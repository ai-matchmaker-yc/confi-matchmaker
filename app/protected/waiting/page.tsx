"use client"

import React, { useState, useEffect } from 'react';
import { Users, Clock, Sparkles, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';

const WaitingPage = () => {
  const router = useRouter();
  const [dots, setDots] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [tip, setTip] = useState(0);
  const [currentlyMatching, setCurrentlyMatching] = useState(false)

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
      setUserCount(prev => { return Math.min(prev + Math.floor(Math.random() * 3 + 1), 100) });
    }, 500);

    // Rotate tips
    const tipInterval = setInterval(() => {
      setTip(prev => (prev + 1) % tips.length);
    }, 5000);


    return () => {
      clearInterval(dotsInterval);
      clearInterval(countInterval);
      clearInterval(tipInterval);
    };
  }, []);

  useEffect(() => {
    console.log(userCount)
  }, [userCount])

  return (
    // <div className="h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
    <div className="w-full mt-32">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Welcome to Supabase Hackaton</CardTitle>
        <CardDescription className="text-center">
          Waiting for more people to join
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          {/* Progress Indicator */}

          {/* User Count */}
          <div className="bg-secondary/20 rounded-lg p-4 flex items-center justify-between overflow-hidden">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm">Active Users</span>
            </div>
            <Badge variant="secondary">{userCount} online</Badge>
          </div>
          <Progress indicatorColor={userCount >= minUsers ? "bg-green-500" : ""} value={Math.min(userCount / minUsers, 1) * 100} className="w-full rounded-b-lg rounded-t-none h-2" />
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

        <div className='flex flex-col gap-2'>
          {/* Action Button */}
          <Button 
          variant="outline" 
          className="w-full"
          onClick={() => router.push('/protected/preferences')}
        >
            Add preferences to who you want to meat
          </Button>
          <Button variant="outline" className="w-full">
            Browse Conference Schedule While Waiting
          </Button>
        </div>
      </CardContent>
    </div>
    // </div>
  );
};

export default WaitingPage;