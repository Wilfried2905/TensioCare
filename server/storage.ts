import { 
  users, measurements, subscriptions, payments, notifications, medications, messages,
  type User, type InsertUser, type Measurement, type InsertMeasurement,
  type Subscription, type InsertSubscription, type Payment, type InsertPayment,
  type Notification, type InsertNotification, type Medication, type InsertMedication,
  type Message, type InsertMessage
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Measurements
  getMeasurements(patientId: number, limit?: number): Promise<Measurement[]>;
  getMeasurementsByDateRange(patientId: number, startDate: Date, endDate: Date): Promise<Measurement[]>;
  createMeasurement(measurement: InsertMeasurement): Promise<Measurement>;
  deleteMeasurement(id: number): Promise<boolean>;
  
  // Subscriptions
  getSubscription(patientId: number): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscriptionStatus(id: number, status: string): Promise<Subscription | undefined>;
  
  // Payments
  getPayments(subscriptionId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(id: number, status: string): Promise<Payment | undefined>;
  
  // Notifications
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<boolean>;
  
  // Medications
  getMedications(patientId: number): Promise<Medication[]>;
  createMedication(medication: InsertMedication): Promise<Medication>;
  updateMedication(id: number, updates: Partial<Medication>): Promise<Medication | undefined>;
  deleteMedication(id: number): Promise<boolean>;
  
  // Messages
  getMessages(userId: number): Promise<Message[]>;
  getConversation(senderId: number, receiverId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private measurements: Map<number, Measurement>;
  private subscriptions: Map<number, Subscription>;
  private payments: Map<number, Payment>;
  private notifications: Map<number, Notification>;
  private medications: Map<number, Medication>;
  private messages: Map<number, Message>;
  private currentUserId: number;
  private currentMeasurementId: number;
  private currentSubscriptionId: number;
  private currentPaymentId: number;
  private currentNotificationId: number;
  private currentMedicationId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.measurements = new Map();
    this.subscriptions = new Map();
    this.payments = new Map();
    this.notifications = new Map();
    this.medications = new Map();
    this.messages = new Map();
    this.currentUserId = 1;
    this.currentMeasurementId = 1;
    this.currentSubscriptionId = 1;
    this.currentPaymentId = 1;
    this.currentNotificationId = 1;
    this.currentMedicationId = 1;
    this.currentMessageId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Create demo users
    const patient: User = {
      id: this.currentUserId++,
      username: "patient",
      password: "patient",
      role: "patient",
      firstName: "Marie",
      lastName: "Dupont",
      email: "marie.dupont@email.com",
      phone: "+22555123456",
      createdAt: new Date(),
    };
    this.users.set(patient.id, patient);

    const medecin: User = {
      id: this.currentUserId++,
      username: "medecin",
      password: "medecin",
      role: "medecin",
      firstName: "Dr. Jean",
      lastName: "Martin",
      email: "dr.martin@clinic.com",
      phone: "+22555654321",
      createdAt: new Date(),
    };
    this.users.set(medecin.id, medecin);

    const admin: User = {
      id: this.currentUserId++,
      username: "admin",
      password: "admin",
      role: "admin",
      firstName: "Admin",
      lastName: "System",
      email: "admin@tensiocare.com",
      phone: "+22555999888",
      createdAt: new Date(),
    };
    this.users.set(admin.id, admin);

    // Create subscription for patient (expires in 2 days for testing alert)
    const nearExpiryDate = new Date();
    nearExpiryDate.setDate(nearExpiryDate.getDate() + 2);
    
    const subscription: Subscription = {
      id: this.currentSubscriptionId++,
      patientId: patient.id,
      status: "active",
      plan: "monthly",
      amount: 5000,
      startDate: new Date("2024-02-15"),
      endDate: nearExpiryDate,
      paymentMethod: "orange_money",
      createdAt: new Date(),
    };
    this.subscriptions.set(subscription.id, subscription);

    // Create sample measurements for patient
    const measurementDates = [
      new Date("2024-02-16T14:30:00"),
      new Date("2024-02-15T09:15:00"),
      new Date("2024-02-14T19:00:00"),
      new Date("2024-02-13T08:30:00"),
      new Date("2024-02-12T20:15:00"),
    ];

    const measurementData = [
      { systolic: 128, diastolic: 82, pulse: 72, context: "repos", comment: "Après repos" },
      { systolic: 142, diastolic: 88, pulse: 78, context: "stress", comment: "Stress au travail" },
      { systolic: 125, diastolic: 79, pulse: 68, context: "repos", comment: "Soirée calme" },
      { systolic: 135, diastolic: 85, pulse: 75, context: "apres_repas", comment: "Après déjeuner" },
      { systolic: 130, diastolic: 83, pulse: 70, context: "matin", comment: "Matin au réveil" },
    ];

    measurementData.forEach((data, index) => {
      const measurement: Measurement = {
        id: this.currentMeasurementId++,
        patientId: patient.id,
        systolic: data.systolic,
        diastolic: data.diastolic,
        pulse: data.pulse,
        context: data.context,
        comment: data.comment,
        measuredAt: measurementDates[index],
        createdAt: measurementDates[index],
      };
      this.measurements.set(measurement.id, measurement);
    });

    // Create sample notifications
    const notifications = [
      {
        userId: patient.id,
        type: "doctor_message",
        title: "Message du Dr. Martin",
        message: "Vos mesures s'améliorent, continuez ainsi ! Pensez à réduire le sel.",
        isRead: false,
      },
      {
        userId: patient.id,
        type: "measurement_reminder",
        title: "Rappel de prise",
        message: "N'oubliez pas votre mesure de ce soir (vers 20h)",
        isRead: false,
      },
    ];

    notifications.forEach((notif) => {
      const notification: Notification = {
        id: this.currentNotificationId++,
        ...notif,
        createdAt: new Date(),
      };
      this.notifications.set(notification.id, notification);
    });

    // Create sample medications for patient
    const medications: Medication[] = [
      {
        id: this.currentMedicationId++,
        patientId: patient.id,
        name: "Amlodipine",
        dosage: "5mg",
        frequency: "daily",
        instructions: "À prendre le matin, avec ou sans nourriture",
        prescribedBy: "Dr. Martin",
        startDate: new Date("2024-02-01"),
        endDate: null,
        isActive: true,
        reminderEnabled: true,
        reminderTimes: ["08:00"],
        createdAt: new Date(),
      },
      {
        id: this.currentMedicationId++,
        patientId: patient.id,
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "daily",
        instructions: "À prendre le soir, éviter les aliments riches en potassium",
        prescribedBy: "Dr. Martin",
        startDate: new Date("2024-02-01"),
        endDate: null,
        isActive: true,
        reminderEnabled: true,
        reminderTimes: ["20:00"],
        createdAt: new Date(),
      }
    ];

    medications.forEach(med => this.medications.set(med.id, med));

    // Create sample messages
    const messages: Message[] = [
      {
        id: this.currentMessageId++,
        senderId: medecin.id,
        receiverId: patient.id,
        content: "Bonjour Marie, j'ai examiné vos dernières mesures de tension. Elles montrent une amélioration notable depuis le début du traitement.",
        type: "text",
        isRead: false,
        priority: "normal",
        createdAt: new Date("2024-02-16T10:30:00"),
      },
      {
        id: this.currentMessageId++,
        senderId: patient.id,
        receiverId: medecin.id,
        content: "Docteur, j'ai eu quelques étourdissements ce matin. Est-ce normal avec le nouveau dosage ?",
        type: "text",
        isRead: false,
        priority: "normal",
        createdAt: new Date("2024-02-16T08:45:00"),
      }
    ];

    messages.forEach(msg => this.messages.set(msg.id, msg));

    // Create sample payment
    const payment: Payment = {
      id: this.currentPaymentId++,
      subscriptionId: subscription.id,
      amount: 5000,
      paymentMethod: "orange_money",
      transactionId: "OM240215001",
      status: "completed",
      paidAt: new Date("2024-02-15T10:30:00"),
      createdAt: new Date("2024-02-15T10:30:00"),
    };
    this.payments.set(payment.id, payment);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      ...insertUser,
      email: insertUser.email || null,
      phone: insertUser.phone || null,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getMeasurements(patientId: number, limit?: number): Promise<Measurement[]> {
    const userMeasurements = Array.from(this.measurements.values())
      .filter(m => m.patientId === patientId)
      .sort((a, b) => b.measuredAt.getTime() - a.measuredAt.getTime());
    
    return limit ? userMeasurements.slice(0, limit) : userMeasurements;
  }

  async getMeasurementsByDateRange(patientId: number, startDate: Date, endDate: Date): Promise<Measurement[]> {
    return Array.from(this.measurements.values())
      .filter(m => 
        m.patientId === patientId &&
        m.measuredAt >= startDate &&
        m.measuredAt <= endDate
      )
      .sort((a, b) => a.measuredAt.getTime() - b.measuredAt.getTime());
  }

  async createMeasurement(insertMeasurement: InsertMeasurement): Promise<Measurement> {
    const measurement: Measurement = {
      id: this.currentMeasurementId++,
      ...insertMeasurement,
      context: insertMeasurement.context || null,
      comment: insertMeasurement.comment || null,
      createdAt: new Date(),
    };
    this.measurements.set(measurement.id, measurement);
    return measurement;
  }

  async deleteMeasurement(id: number): Promise<boolean> {
    return this.measurements.delete(id);
  }

  async getSubscription(patientId: number): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(s => s.patientId === patientId);
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const subscription: Subscription = {
      id: this.currentSubscriptionId++,
      ...insertSubscription,
      paymentMethod: insertSubscription.paymentMethod || null,
      createdAt: new Date(),
    };
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  async updateSubscriptionStatus(id: number, status: string): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (subscription) {
      subscription.status = status;
      this.subscriptions.set(id, subscription);
      return subscription;
    }
    return undefined;
  }

  async getPayments(subscriptionId: number): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(p => p.subscriptionId === subscriptionId)
      .sort((a, b) => (b.paidAt?.getTime() || 0) - (a.paidAt?.getTime() || 0));
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const payment: Payment = {
      id: this.currentPaymentId++,
      ...insertPayment,
      transactionId: insertPayment.transactionId || null,
      paidAt: insertPayment.paidAt || null,
      createdAt: new Date(),
    };
    this.payments.set(payment.id, payment);
    return payment;
  }

  async updatePaymentStatus(id: number, status: string): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (payment) {
      payment.status = status;
      if (status === "completed") {
        payment.paidAt = new Date();
      }
      this.payments.set(id, payment);
      return payment;
    }
    return undefined;
  }

  async getNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const notification: Notification = {
      id: this.currentNotificationId++,
      ...insertNotification,
      isRead: insertNotification.isRead || false,
      createdAt: new Date(),
    };
    this.notifications.set(notification.id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(id, notification);
      return true;
    }
    return false;
  }
  
  // Medications
  async getMedications(patientId: number): Promise<Medication[]> {
    return Array.from(this.medications.values())
      .filter(med => med.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createMedication(insertMedication: InsertMedication): Promise<Medication> {
    const medication: Medication = {
      id: this.currentMedicationId++,
      ...insertMedication,
      createdAt: new Date(),
    };
    this.medications.set(medication.id, medication);
    return medication;
  }

  async updateMedication(id: number, updates: Partial<Medication>): Promise<Medication | undefined> {
    const medication = this.medications.get(id);
    if (medication) {
      Object.assign(medication, updates);
      return medication;
    }
    return undefined;
  }

  async deleteMedication(id: number): Promise<boolean> {
    return this.medications.delete(id);
  }

  // Messages
  async getMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.senderId === userId || msg.receiverId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getConversation(senderId: number, receiverId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => 
        (msg.senderId === senderId && msg.receiverId === receiverId) ||
        (msg.senderId === receiverId && msg.receiverId === senderId)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      id: this.currentMessageId++,
      ...insertMessage,
      createdAt: new Date(),
    };
    this.messages.set(message.id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    const message = this.messages.get(id);
    if (message) {
      message.isRead = true;
      return true;
    }
    return false;
  }
}

export const storage = new MemStorage();
