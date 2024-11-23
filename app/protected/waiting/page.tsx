"use client"

import React, { useState, useEffect } from 'react';
import { Users, Clock, Sparkles, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const WaitingPage = () => {
  const [dots, setDots] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [tip, setTip] = useState(0);
  const [progress, setProgress] = useState(13);

  const minUsers = 60

  const tips = [
    "Pro tip: Mention your favorite conference talks to break the ice!",
    "Remember to add your interests to your profile for better matches",
    "Looking for mentorship? Mention it in your preferences",
    "Don't forget to set your availability during the conference",
    "Great conversations often start with a simple 'hello'!"
  ];

  useEffect(() => {
    // Animate loading dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Simulate increasing user count
    const countInterval = setInterval(() => {
      setUserCount(prev => Math.min(prev + Math.floor(Math.random() * 3), 45));
    }, 2000);

    // Rotate tips
    const tipInterval = setInterval(() => {
      setTip(prev => (prev + 1) % tips.length);
    }, 5000);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => prev < 90 ? prev + 1 : prev);
    }, 1000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(countInterval);
      clearInterval(tipInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    // <div className="h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to Supabase Hackaton</CardTitle>
          <CardDescription className="text-center">
            Waiting for more people to join
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            {/* Progress Indicator */}
            <div className="space-y-2">
              <Progress value={(userCount / minUsers) * 100} className="w-full rounded-t-none" />
              <p className="text-sm text-gray-500 text-center">
            
              </p>
            </div>
            {/* User Count */}
            <div className="bg-secondary/20 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm">Active Users</span>
              </div>
              <Badge variant="secondary">{userCount} online</Badge>
            </div>
          </div>

          {/* Tips Section */}
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              {tips[tip]}
            </AlertDescription>
          </Alert>

          {/* Status Updates */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm text-gray-600">
                Estimated wait time: 1-2 minutes
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button variant="outline" className="w-full">
            Browse Conference Schedule While Waiting
          </Button>
        </CardContent>
      </div>
    // </div>
  );
};

export default WaitingPage;