/**
 * Mock Interview Component
 * AI-powered interview simulation with timing and response recording
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Mic, 
  MicOff, 
  SkipForward,
  CheckCircle,
  AlertCircle,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';

const MockInterview = ({ 
  questions = [], 
  config = {}, 
  onComplete,
  onQuestionComplete,
  onSessionUpdate 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [currentResponse, setCurrentResponse] = useState('');
  const [sessionState, setSessionState] = useState('setup'); // setup, active, paused, completed
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionId] = useState(`interview_${Date.now()}`);
  
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const {
    duration = 60, // minutes
    allowSkip = true,
    timePerQuestion = 5, // minutes
    recordAudio = false,
    difficulty = 'medium',
    role = 'general'
  } = config;

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Timer management
  useEffect(() => {
    if (sessionState === 'active') {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [sessionState]);

  // Session update callback
  useEffect(() => {
    if (onSessionUpdate) {
      onSessionUpdate({
        sessionId,
        currentQuestionIndex,
        timeElapsed,
        responses: responses.length,
        state: sessionState
      });
    }
  }, [currentQuestionIndex, timeElapsed, responses.length, sessionState, sessionId, onSessionUpdate]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start interview session
  const startInterview = () => {
    setSessionState('active');
    setQuestionStartTime(Date.now());
    toast.success('Interview started! Take your time to think before answering.');
  };

  // Pause interview
  const pauseInterview = () => {
    setSessionState('paused');
    stopAudioRecording();
    toast.info('Interview paused. Click resume when ready to continue.');
  };

  // Resume interview
  const resumeInterview = () => {
    setSessionState('active');
    setQuestionStartTime(Date.now() - (responses[currentQuestionIndex]?.timeSpent || 0) * 1000);
  };

  // Stop interview
  const stopInterview = () => {
    setSessionState('completed');
    stopAudioRecording();
    
    const finalSession = {
      sessionId,
      questions,
      responses,
      totalTime: timeElapsed,
      completedQuestions: responses.length,
      config,
      completedAt: new Date().toISOString()
    };

    if (onComplete) {
      onComplete(finalSession);
    }
  };

  // Start audio recording
  const startAudioRecording = async () => {
    if (!recordAudio) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting audio recording:', error);
      toast.error('Could not start audio recording. Continuing without audio.');
    }
  };

  // Stop audio recording
  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Submit current response and move to next question
  const submitResponse = () => {
    if (!currentResponse.trim()) {
      toast.error('Please provide a response before continuing.');
      return;
    }

    const questionTime = questionStartTime ? (Date.now() - questionStartTime) / 1000 : 0;
    
    const response = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      response: currentResponse,
      timeSpent: questionTime,
      timestamp: new Date().toISOString(),
      audioBlob: isRecording && audioChunksRef.current.length > 0 
        ? new Blob(audioChunksRef.current, { type: 'audio/webm' })
        : null
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);

    if (onQuestionComplete) {
      onQuestionComplete(response, currentQuestionIndex);
    }

    // Move to next question or complete interview
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentResponse('');
      setQuestionStartTime(Date.now());
      
      // Restart audio recording for next question
      if (recordAudio) {
        stopAudioRecording();
        setTimeout(() => startAudioRecording(), 100);
      }
    } else {
      stopInterview();
    }
  };

  // Skip current question
  const skipQuestion = () => {
    if (!allowSkip) return;

    const response = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      response: '[SKIPPED]',
      timeSpent: questionStartTime ? (Date.now() - questionStartTime) / 1000 : 0,
      timestamp: new Date().toISOString(),
      skipped: true
    };

    const newResponses = [...responses, response];
    setResponses(newResponses);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentResponse('');
      setQuestionStartTime(Date.now());
    } else {
      stopInterview();
    }

    toast.info('Question skipped.');
  };

  // Setup screen
  if (sessionState === 'setup') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-6 w-6" />
            Mock Interview Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Interview Details</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Questions: {totalQuestions}</p>
                <p>Estimated Duration: {duration} minutes</p>
                <p>Difficulty: <Badge variant="outline">{difficulty}</Badge></p>
                <p>Role: <Badge variant="outline">{role}</Badge></p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Features</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>✓ Timed responses</p>
                <p>✓ Progress tracking</p>
                <p>{allowSkip ? '✓' : '✗'} Skip questions</p>
                <p>{recordAudio ? '✓' : '✗'} Audio recording</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Interview Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Take time to think before answering</li>
              <li>• Use the STAR method for behavioral questions</li>
              <li>• Be specific and provide examples</li>
              <li>• Ask clarifying questions if needed</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button onClick={startInterview} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Interview
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Completed screen
  if (sessionState === 'completed') {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Interview Completed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{responses.length}</div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatTime(timeElapsed)}</div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((responses.filter(r => !r.skipped).length / totalQuestions) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800">
              Great job! Your responses have been recorded and will be analyzed for feedback.
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
              Start New Interview
            </Button>
            <Button onClick={() => onComplete && onComplete()} className="flex-1">
              View Results
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active interview screen
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              {formatTime(timeElapsed)}
            </div>
            {recordAudio && (
              <div className="flex items-center gap-2">
                {isRecording ? (
                  <Mic className="h-4 w-4 text-red-500 animate-pulse" />
                ) : (
                  <MicOff className="h-4 w-4 text-gray-400" />
                )}
              </div>
            )}
          </div>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question Display */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start gap-3 mb-4">
            <Badge variant="outline">{currentQuestion.type}</Badge>
            <Badge variant="outline">{currentQuestion.difficulty}</Badge>
            {currentQuestion.category && (
              <Badge variant="outline">{currentQuestion.category}</Badge>
            )}
          </div>
          
          <h3 className="text-lg font-semibold mb-3">{currentQuestion.question}</h3>
          
          {currentQuestion.evaluationCriteria && (
            <div className="mt-4">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Consider these points:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {currentQuestion.evaluationCriteria.map((criteria, index) => (
                  <li key={index}>• {criteria}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Response Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">Your Response</label>
          <Textarea
            value={currentResponse}
            onChange={(e) => setCurrentResponse(e.target.value)}
            placeholder="Type your response here... Take your time to provide a detailed answer."
            className="min-h-[150px]"
            disabled={sessionState === 'paused'}
          />
          <div className="text-xs text-gray-500">
            {currentResponse.length} characters
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {sessionState === 'active' ? (
              <Button onClick={pauseInterview} variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            ) : (
              <Button onClick={resumeInterview} variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            )}
            
            <Button onClick={stopInterview} variant="outline">
              <Square className="h-4 w-4 mr-2" />
              End Interview
            </Button>
          </div>

          <div className="flex gap-2">
            {allowSkip && (
              <Button onClick={skipQuestion} variant="outline">
                <SkipForward className="h-4 w-4 mr-2" />
                Skip
              </Button>
            )}
            
            <Button 
              onClick={submitResponse} 
              disabled={!currentResponse.trim() || sessionState === 'paused'}
            >
              {currentQuestionIndex === totalQuestions - 1 ? 'Complete Interview' : 'Next Question'}
            </Button>
          </div>
        </div>

        {/* Session Info */}
        <div className="text-xs text-gray-500 border-t pt-3">
          Session ID: {sessionId} | 
          Questions Answered: {responses.length}/{totalQuestions} | 
          Time per Question: ~{timePerQuestion} min recommended
        </div>
      </CardContent>
    </Card>
  );
};

export default MockInterview;