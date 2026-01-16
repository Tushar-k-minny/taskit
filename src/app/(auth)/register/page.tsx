"use client";

import {
  CircleNotch,
  Eye,
  EyeClosed,
  ListChecks,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { signUp } from "@/lib/auth-client";
import { signUpSchema } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validated = signUpSchema.parse(formData);

      const result = await signUp.email({
        name: validated.name,
        email: validated.email,
        password: validated.password,
      });

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message || "Failed to create account",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account created!",
        description: "Welcome to Taskit. Let's get started!",
        variant: "success",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="text-center">
        <Link
          className="gradient-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-200 hover:scale-105"
          href="/"
        >
          <ListChecks className="h-6 w-6 text-white" weight="bold" />
        </Link>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Get started with Taskit for free</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              disabled={isLoading}
              id="name"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="John Doe"
              required
              type="text"
              value={formData.name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              disabled={isLoading}
              id="email"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="you@example.com"
              required
              type="email"
              value={formData.email}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                disabled={isLoading}
                id="password"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="••••••••"
                required
                type={showPassword ? "text" : "password"}
                value={formData.password}
              />
              <Button
                className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                size="icon"
                type="button"
                variant="ghost"
              >
                {showPassword ? (
                  <EyeClosed
                    className="h-4 w-4 text-muted-foreground"
                    weight="bold"
                  />
                ) : (
                  <Eye
                    className="h-4 w-4 text-muted-foreground"
                    weight="bold"
                  />
                )}
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Must be at least 8 characters
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? (
              <>
                <CircleNotch className="h-4 w-4 animate-spin" weight="bold" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
          <p className="text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href="/login"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
