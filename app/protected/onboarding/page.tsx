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
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

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
  interestString: z.string().max(150),
});

const step3Schema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  profilePicture: z.instanceof(File).optional(),
});

type Step1Schema = z.infer<typeof step1Schema>;
type Step3Schema = z.infer<typeof step3Schema>;
type Step2Schema = z.infer<typeof step2Schema>;

const fetchUserData = async (
  linkedinUrl: string,
  githubUrl: string,
  interestString: string,
  supabaseClient: SupabaseClient
): Promise<{
  firstName: string;
  lastName: string;
  photoUrl: string;
} | null> => {
  try {
    console.log("Fetching data", linkedinUrl);
    const user = await supabaseClient.auth.getUser();

    if (!user.data.user) {
      console.error("not logged in");
      return { firstName: "", lastName: "", photoUrl: "" };
    }

    const response = await supabaseClient.functions.invoke("parse-linkedin", {
      body: {
        linkedinProfileUrl: linkedinUrl,
        githubProfileUrl: githubUrl,
        interestString: interestString,
        userId: user.data.user.id,
      },
    });

    if (response.error) {
      console.error("Error fetching data:", response.error.message);
      return null;
    }

    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return null;
  }
};

export default function Onboarding() {
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [github, setGithub] = useState<string | null>(null);
  const [linkedin, setLinkedin] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    profilePicture: string;
    interestString: string;
  }>({
    firstName: "",
    lastName: "",
    profilePicture: "",
    interestString: "",
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
      interestString: ""
    }
  });

  const step3Form = useForm<Step3Schema>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      profilePicture: undefined,
    },
  });

  const onStep1Submit = (data: Step1Schema) => {
    setGithub(data.github);
    setLinkedin(data.linkedin);
    setStep(2);
  };

  const onStep2Submit = async (data: Step2Schema) => {
    const interestString = data.interestString;
    const fetchedData = await fetchUserData(
      linkedin!,
      github!,
      interestString!,
      supabase
    );
    if (!fetchedData) {
      console.error("fuck... idk man");
    } else {
      setUserData({
        firstName: userData.firstName,
        lastName: userData.lastName,
        profilePicture: userData.profilePicture,
        interestString: data.interestString || '',
      });
      step3Form.setValue("firstName", fetchedData.firstName);
      step3Form.setValue("lastName", fetchedData.lastName);
      setStep(3);
    };
  }

  const onStep3Submit = async (data: Step3Schema) => {
    const finalData = {
      ...step1Form.getValues(),
      ...data,
    };
    console.log("Onboarding complete", finalData);
    const user = await supabase.auth.getUser();
    await supabase
      .from("profiles")
      .update({
        first_name: finalData.firstName,
        last_name: finalData.lastName,
        github_url: finalData.github,
        linkedin_url: finalData.linkedin,
      })
      .eq("id", user!.data!.user!.id);
    redirect("/protected/waiting");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      step3Form.setValue("profilePicture", file);
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
      <Card className="w-full overflow-hidden">
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
                  : step === 2
                    ? "What are your interests?"
                    : "Confirm your profile"}
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
              ) : step === 2 ? (
                <Form {...step2Form}>
                  <form
                    onSubmit={step2Form.handleSubmit(onStep2Submit)}
                    className="space-y-4"
                  >
                    <p className="text-center text-gray-600">
                      Tell us about your interests!
                    </p>
                    <FormField
                      control={step2Form.control}
                      name="interestString"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your interests</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                {...field}
                                placeholder="At this conference, I wish to...."
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
                      <Button type="submit" className="w-full">
                        Skip
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...step3Form}>
                  <form
                    onSubmit={step3Form.handleSubmit(onStep3Submit)}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <Avatar className="w-24 h-24 mx-auto">
                        <AvatarImage
                          src={userData.profilePicture}
                          alt={userData.firstName}
                        />
                        <AvatarFallback>
                          {userData.firstName.charAt(0)}
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
                      control={step3Form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Your Name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={step3Form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
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
