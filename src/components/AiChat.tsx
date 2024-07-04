import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MedplumClient } from '@medplum/core';
import { useParams } from 'react-router-dom';

const medplum = new MedplumClient();

async function fetchPatientData(patientId: string | null) {
  if (!patientId) {
    return null;
  }
  try {
    const patient = await medplum.readResource('Patient', patientId);
    const observations = await medplum.search('Observation', 'subject=' + patientId);
    const medications = await medplum.search('MedicationStatement', 'subject=' + patientId);
    return { patient, observations, medications };
  } catch (error) {
    console.error('Error fetching patient data:', error);
    return null;
  }
}

function createPatientContext(patientData: any) {
  if (!patientData) return '';
  
  const { patient, observations, medications } = patientData;
  let context = `Patient ${patient.name[0].given} ${patient.name[0].family}, ${patient.gender}, born ${patient.birthDate}.\n`;
  context += `Recent observations:\n`;
  observations.entry.slice(0, 5).forEach((obs: any) => {
    context += `- ${obs.resource.code.text}: ${obs.resource.valueQuantity.value} ${obs.resource.valueQuantity.unit}\n`;
  });
  context += `Current medications:\n`;
  medications.entry.forEach((med: any) => {
    context += `- ${med.resource.medicationCodeableConcept.text}\n`;
  });
  return context;
}

const AiChat: React.FC = () => {
  const { patientId } = useParams<{ patientId?: string }>();
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [inputText, setInputText] = useState('');
  const [patientContext, setPatientContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadPatientData() {
      setIsLoading(true);
      const patientData = await fetchPatientData(patientId || null);
      const context = createPatientContext(patientData);
      setPatientContext(context);
      setIsLoading(false);
      if (!patientData) {
        setMessages([{ text: "No specific patient data loaded. You can still ask general medical questions.", isUser: false }]);
      }
    }
    loadPatientData();
  }, [patientId]);

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
  
    console.log('Sending message:', inputText);
    setMessages(prev => [...prev, { text: inputText, isUser: true }]);
    setInputText('');
    setIsLoading(true);
  
    try {
      console.log('Sending request to server');
      const response = await axios.post('http://127.0.0.1:5000/analyze', {
        text: inputText,
        context: patientContext
      });
      console.log('Received response:', response.data);
  
      setMessages(prev => [...prev, { text: response.data.analysis, isUser: false }]);
    } catch (error) {
      console.error('Error in AI chat:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      setMessages(prev => [...prev, { text: "Sorry, I couldn't process that request. Please try again later.", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user' : 'ai'}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message ai">Thinking...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask a medical question..."
          disabled={isLoading}
        />
        <button onClick={handleSendMessage} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default AiChat;