import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertMeasurementSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Identifiants invalides" });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(400).json({ message: "Données invalides" });
    }
  });

  // Measurements routes
  app.get("/api/measurements", async (req, res) => {
    try {
      // Default to user ID 1 (patient) for demo
      const patientId = req.query.patientId as string || "1";
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      if (!patientId) {
        return res.status(400).json({ message: "Patient ID requis" });
      }

      const measurements = await storage.getMeasurements(parseInt(patientId), limit);
      res.json(measurements);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.get("/api/measurements/range", async (req, res) => {
    try {
      // Default to user ID 1 (patient) for demo
      const patientId = req.query.patientId as string || "1";
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);
      
      if (!patientId || !req.query.startDate || !req.query.endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Paramètres manquants" });
      }

      const measurements = await storage.getMeasurementsByDateRange(parseInt(patientId), startDate, endDate);
      res.json(measurements);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/measurements", async (req, res) => {
    try {
      const measurementData = insertMeasurementSchema.parse(req.body);
      const measurement = await storage.createMeasurement(measurementData);
      res.json(measurement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Subscription routes
  app.get("/api/subscription/:patientId", async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const subscription = await storage.getSubscription(patientId);
      
      if (!subscription) {
        return res.status(404).json({ message: "Abonnement non trouvé" });
      }
      
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Payments routes
  app.get("/api/payments/:subscriptionId", async (req, res) => {
    try {
      const subscriptionId = parseInt(req.params.subscriptionId);
      const payments = await storage.getPayments(subscriptionId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Notifications routes
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markNotificationAsRead(id);
      
      if (!success) {
        return res.status(404).json({ message: "Notification non trouvée" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // Medications routes
  app.get("/api/medications", async (req, res) => {
    try {
      const { patientId } = req.query;
      if (!patientId) {
        return res.status(400).json({ message: "ID patient requis" });
      }
      const medications = await storage.getMedications(Number(patientId));
      res.json(medications);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/medications", async (req, res) => {
    try {
      const medication = await storage.createMedication(req.body);
      res.status(201).json(medication);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création" });
    }
  });

  app.put("/api/medications/:id", async (req, res) => {
    try {
      const medication = await storage.updateMedication(Number(req.params.id), req.body);
      if (!medication) {
        return res.status(404).json({ message: "Médicament non trouvé" });
      }
      res.json(medication);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
  });

  app.delete("/api/medications/:id", async (req, res) => {
    try {
      const success = await storage.deleteMedication(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Médicament non trouvé" });
      }
      res.json({ message: "Médicament supprimé" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression" });
    }
  });

  // Messages routes
  app.get("/api/messages", async (req, res) => {
    try {
      const { userId, doctorId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "ID utilisateur requis" });
      }
      
      let messages;
      if (doctorId) {
        messages = await storage.getConversation(Number(userId), Number(doctorId));
      } else {
        messages = await storage.getMessages(Number(userId));
      }
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const message = await storage.createMessage(req.body);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'envoi" });
    }
  });

  app.put("/api/messages/:id/read", async (req, res) => {
    try {
      const success = await storage.markMessageAsRead(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Message non trouvé" });
      }
      res.json({ message: "Message marqué comme lu" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
