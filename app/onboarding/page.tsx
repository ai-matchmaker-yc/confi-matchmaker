"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Github, Linkedin } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const urlSchema = z.string().url().startsWith("https://");

const step1Schema = z.object({
  linkedin: urlSchema.refine((url) => url.includes("linkedin.com"), {
    message: "Must be a valid LinkedIn URL",
  }),
  github: urlSchema.refine((url) => url.includes("github.com"), {
    message: "Must be a valid GitHub URL",
  }),
});

const step2Schema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  profilePicture: z.instanceof(File).optional(),
});

type Step1Schema = z.infer<typeof step1Schema>;
type Step2Schema = z.infer<typeof step2Schema>;

// Mock function to simulate fetching user data
const fetchUserData = async (linkedin: string, github: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    name: "John Doe",
    profilePicture: "https://github.com/shadcn.png",
  };
};

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<{
    name: string;
    profilePicture: string;
  }>({
    name: "",
    profilePicture: "",
  });

  const step1Form = useForm<Step1Schema>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      linkedin: "",
      github: "",
    },
  });

  const step2Form = useForm<Step2Schema>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      name: "",
      profilePicture: undefined,
    },
  });

  const onStep1Submit = async (data: Step1Schema) => {
    const fetchedData = await fetchUserData(data.linkedin, data.github);
    setUserData(fetchedData);
    step2Form.setValue("name", fetchedData.name);
    setStep(2);
  };

  const onStep2Submit = (data: Step2Schema) => {
    const finalData = {
      ...step1Form.getValues(),
      ...data,
    };
    console.log("Onboarding complete", finalData);
    // Here you would typically save the data and proceed to the main app
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      step2Form.setValue("profilePicture", file);
      setUserData((prev) => ({
        ...prev,
        profilePicture: URL.createObjectURL(file),
      }));
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: "-100%" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100%" },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
      <Card className="w-full max-w-md overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {step === 1
                  ? "Welcome! Let's Get Started"
                  : "Confirm Your Profile"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 ? (
                <Form {...step1Form}>
                  <form
                    onSubmit={step1Form.handleSubmit(onStep1Submit)}
                    className="space-y-4"
                  >
                    <p className="text-center text-gray-600">
                      Please enter your LinkedIn and GitHub URLs to help us find
                      the best matches for you.
                    </p>
                    <FormField
                      control={step1Form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn URL</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Linkedin
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                              />
                              <Input
                                {...field}
                                placeholder="https://linkedin.com/in/username"
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={step1Form.control}
                      name="github"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub URL</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Github
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                              />
                              <Input
                                {...field}
                                placeholder="https://github.com/username"
                                className="pl-10"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Next
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...step2Form}>
                  <form
                    onSubmit={step2Form.handleSubmit(onStep2Submit)}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <Avatar className="w-24 h-24 mx-auto">
                        <AvatarImage
                          src={userData.profilePicture}
                          alt={userData.name}
                        />
                        <AvatarFallback>
                          {userData.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Label
                        htmlFor="picture"
                        className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                      >
                        Change Picture
                      </Label>
                      <Input
                        id="picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                    <FormField
                      control={step2Form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Your Name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <p className="text-center text-gray-600">
                      Please confirm or update your information.
                    </p>
                    <Button type="submit" className="w-full">
                      Confirm
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step === 2 && (
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
              )}
            </CardFooter>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
