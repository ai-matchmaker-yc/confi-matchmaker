"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

const formSchema = z.object({
  linkedin: z
    .string()
    .url()
    .refine((url) => url.includes("linkedin.com"), {
      message: "Must be a valid LinkedIn URL",
    }),
  github: z
    .string()
    .url()
    .refine((url) => url.includes("github.com"), {
      message: "Must be a valid GitHub URL",
    }),
  interestString: z.string().max(150, {
    message: "Interests should be under 150 characters",
  }),
});

const step2Schema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  profilePicture: z.instanceof(File).optional(),
});

type Step2Schema = z.infer<typeof step2Schema>;

type FormSchema = z.infer<typeof formSchema>;

export default function Onboarding() {
  const [disabled, setDisabled] = useState(false);
  const supabase = createClient();

  const step2Form = useForm<Step2Schema>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      profilePicture: undefined,
    },
  });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    return;
    // if (e.target.files && e.target.files[0]) {
    //   const file = e.target.files[0];
    //   step2Form.setValue("profilePicture", file);
    //   setUserData((prev) => ({
    //     ...prev,
    //     profilePicture: URL.createObjectURL(file),
    //   }));
    // }
  };
  const [step, setStep] = useState(1);
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

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkedin: "",
      github: "",
      interestString: "",
    },
  });

  const onFormSubmit = async (data: FormSchema) => {
    setDisabled(true);
    console.log("Fetching user data...");
    const user = await supabase.auth.getUser();
    const response = await supabase.functions.invoke("parse-linkedin", {
      body: {
        linkedinProfileUrl: data.linkedin,
        githubProfileUrl: data.github,
        interestString: data.interestString,
        userId: user.data?.user?.id,
      },
    });

    if (response.error) {
      console.error("Error fetching user data:", response.error.message);
      return;
    }

    const fetchedData = response.data;

    console.log("Fetched data: ", fetchedData);

    setUserData({
      firstName: fetchedData.firstName,
      lastName: fetchedData.lastName,
      profilePicture: fetchedData.photoUrl,
      interestString: data.interestString,
    });
    step2Form.setValue("firstName", fetchedData.firstName);
    step2Form.setValue("lastName", fetchedData.lastName);
    step2Form.setValue("profilePicture", fetchedData.photoUrl);

    setStep(2);
    setDisabled(false);
  };

  const onStep2Submit = async (data: Step2Schema) => {
    console.log("HELOOO?")
    console.log("Onboarding complete", data);
    const finalData = {
      ...form.getValues(),
      ...userData,
      ...data
    };

    const user = await supabase.auth.getUser();
    await supabase
      .from("profiles")
      .update({
        first_name: finalData.firstName,
        last_name: finalData.lastName,
        github_url: finalData.github,
        linkedin_url: finalData.linkedin,
        interest_string: finalData.interestString,
      })
      .eq("id", user!.data!.user!.id);

    redirect("/protected/waiting");
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
                  : "Confirm Your Profile"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {step === 1 ? (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onFormSubmit)}
                    className="space-y-4"
                  >
                    <p className="text-center text-gray-600">
                      Enter your LinkedIn, GitHub, and interests to help us
                      build your profile.
                    </p>
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                    <FormField
                      control={form.control}
                      name="interestString"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Interests (optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="At this conference, I wish to...."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={disabled}>
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
                      control={step2Form.control}
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
                      control={step2Form.control}
                      name="lastName"
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
