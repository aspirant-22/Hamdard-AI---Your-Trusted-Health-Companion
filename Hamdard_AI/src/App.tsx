/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import VoiceTriage from './components/VoiceTriage';
import NutritionScan from './components/NutritionScan';
import MedicineAdvisor from './components/MedicineAdvisor';
import PrescriptionExplainer from './components/PrescriptionExplainer';
import JargonBuster from './components/JargonBuster';
import EmergencyHelp from './components/EmergencyHelp';
import LabReportAnalyzer from './components/LabReportAnalyzer';
import VisualSymptomChecker from './components/VisualSymptomChecker';
import DigitalTherapist from './components/DigitalTherapist';
import PeriodTracker from './components/PeriodTracker';

import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home setActiveTab={setActiveTab} />;
      case 'voice': return <VoiceTriage />;
      case 'nutrition': return <NutritionScan />;
      case 'medicine': return <MedicineAdvisor />;
      case 'prescription': return <PrescriptionExplainer />;
      case 'lab': return <LabReportAnalyzer />;
      case 'visual': return <VisualSymptomChecker />;
      case 'therapist': return <DigitalTherapist />;
      case 'period': return <PeriodTracker />;
      case 'jargon': return <JargonBuster />;
      case 'emergency': return <EmergencyHelp />;
      default: return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <LanguageProvider>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </Layout>
    </LanguageProvider>
  );
}
