// Classification OMS 2023 - Recommandations pour la prise en charge de l'HTA
export interface BloodPressureCategory {
  name: string;
  label: string;
  systolicRange: string;
  diastolicRange: string;
  color: string;
  bgColor: string;
  borderColor: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  recommendations: string[];
}

export const WHO_BP_CATEGORIES: BloodPressureCategory[] = [
  {
    name: 'optimal',
    label: 'Optimale',
    systolicRange: '<120',
    diastolicRange: '<80',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    riskLevel: 'low',
    recommendations: [
      'Maintenir un mode de vie sain',
      'Activité physique régulière',
      'Alimentation équilibrée',
      'Contrôle annuel recommandé'
    ]
  },
  {
    name: 'normal',
    label: 'Normale',
    systolicRange: '120-129',
    diastolicRange: '80-84',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    riskLevel: 'low',
    recommendations: [
      'Continuer les habitudes saines',
      'Surveillance annuelle',
      'Prévention primaire'
    ]
  },
  {
    name: 'high-normal',
    label: 'Normale-Haute',
    systolicRange: '130-139',
    diastolicRange: '85-89',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    riskLevel: 'moderate',
    recommendations: [
      'Surveillance renforcée',
      'Modification du mode de vie',
      'Réduction du sel',
      'Contrôle tous les 6 mois'
    ]
  },
  {
    name: 'grade-1',
    label: 'HTA Grade 1',
    systolicRange: '140-159',
    diastolicRange: '90-99',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    riskLevel: 'high',
    recommendations: [
      'Consultation médicale nécessaire',
      'Évaluation du risque cardiovasculaire',
      'Modification du mode de vie',
      'Considérer un traitement antihypertenseur'
    ]
  },
  {
    name: 'grade-2',
    label: 'HTA Grade 2',
    systolicRange: '160-179',
    diastolicRange: '100-109',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    riskLevel: 'critical',
    recommendations: [
      'Consultation médicale urgente',
      'Traitement antihypertenseur recommandé',
      'Surveillance rapprochée',
      'Évaluation complète des organes cibles'
    ]
  },
  {
    name: 'grade-3',
    label: 'HTA Grade 3',
    systolicRange: '≥180',
    diastolicRange: '≥110',
    color: 'text-red-800',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    riskLevel: 'critical',
    recommendations: [
      'URGENCE MÉDICALE',
      'Consultation immédiate requise',
      'Traitement antihypertenseur immédiat',
      'Hospitalisation possible'
    ]
  },
  {
    name: 'isolated-systolic',
    label: 'HTA Systolique Isolée',
    systolicRange: '≥140',
    diastolicRange: '<90',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    riskLevel: 'high',
    recommendations: [
      'Fréquent chez les personnes âgées',
      'Consultation médicale nécessaire',
      'Évaluation du risque cardiovasculaire',
      'Traitement selon les guidelines'
    ]
  },
  {
    name: 'isolated-diastolic',
    label: 'HTA Diastolique Isolée',
    systolicRange: '<140',
    diastolicRange: '≥90',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    riskLevel: 'high',
    recommendations: [
      'Plus fréquent chez les jeunes',
      'Consultation médicale nécessaire',
      'Surveillance régulière',
      'Modification du mode de vie'
    ]
  }
];

export function classifyBloodPressure(systolic: number, diastolic: number): BloodPressureCategory {
  // Cas spéciaux d'hypertension isolée
  if (systolic >= 140 && diastolic < 90) {
    return WHO_BP_CATEGORIES.find(cat => cat.name === 'isolated-systolic')!;
  }
  
  if (systolic < 140 && diastolic >= 90) {
    return WHO_BP_CATEGORIES.find(cat => cat.name === 'isolated-diastolic')!;
  }

  // Classification standard - la catégorie est définie par le niveau le plus élevé
  if (systolic >= 180 || diastolic >= 110) {
    return WHO_BP_CATEGORIES.find(cat => cat.name === 'grade-3')!;
  }
  
  if ((systolic >= 160 && systolic <= 179) || (diastolic >= 100 && diastolic <= 109)) {
    return WHO_BP_CATEGORIES.find(cat => cat.name === 'grade-2')!;
  }
  
  if ((systolic >= 140 && systolic <= 159) || (diastolic >= 90 && diastolic <= 99)) {
    return WHO_BP_CATEGORIES.find(cat => cat.name === 'grade-1')!;
  }
  
  if ((systolic >= 130 && systolic <= 139) || (diastolic >= 85 && diastolic <= 89)) {
    return WHO_BP_CATEGORIES.find(cat => cat.name === 'high-normal')!;
  }
  
  if ((systolic >= 120 && systolic <= 129) && (diastolic >= 80 && diastolic <= 84)) {
    return WHO_BP_CATEGORIES.find(cat => cat.name === 'normal')!;
  }
  
  // Optimale par défaut
  return WHO_BP_CATEGORIES.find(cat => cat.name === 'optimal')!;
}

export function getBloodPressureStatus(systolic: number, diastolic: number) {
  const category = classifyBloodPressure(systolic, diastolic);
  
  return {
    category: category.name,
    label: category.label,
    color: category.color,
    bgColor: category.bgColor,
    borderColor: category.borderColor,
    riskLevel: category.riskLevel,
    recommendations: category.recommendations,
    systolicRange: category.systolicRange,
    diastolicRange: category.diastolicRange,
    isUrgent: category.riskLevel === 'critical',
    needsConsultation: ['high', 'critical'].includes(category.riskLevel)
  };
}

export function formatBloodPressure(systolic: number, diastolic: number): string {
  return `${systolic}/${diastolic} mmHg`;
}

export function getBloodPressureTrend(measurements: Array<{systolic: number, diastolic: number, createdAt: Date}>) {
  if (measurements.length < 2) return 'insufficient_data';
  
  const recent = measurements.slice(-3);
  const older = measurements.slice(-6, -3);
  
  if (recent.length === 0 || older.length === 0) return 'insufficient_data';
  
  const recentAvg = {
    systolic: recent.reduce((sum, m) => sum + m.systolic, 0) / recent.length,
    diastolic: recent.reduce((sum, m) => sum + m.diastolic, 0) / recent.length
  };
  
  const olderAvg = {
    systolic: older.reduce((sum, m) => sum + m.systolic, 0) / older.length,
    diastolic: older.reduce((sum, m) => sum + m.diastolic, 0) / older.length
  };
  
  const systolicDiff = recentAvg.systolic - olderAvg.systolic;
  const diastolicDiff = recentAvg.diastolic - olderAvg.diastolic;
  
  // Seuil de 5 mmHg pour considérer une tendance significative
  if (systolicDiff > 5 || diastolicDiff > 5) return 'increasing';
  if (systolicDiff < -5 || diastolicDiff < -5) return 'decreasing';
  return 'stable';
}