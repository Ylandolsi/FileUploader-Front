"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Link } from "react-router-dom";

import { authService } from "@/services/AuthService";
import { useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";

const formSchema = z
  .object({
    username: z.string().min(1, { message: "Username is Required" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
        }
      ),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type typeForm = typeof formSchema;

export function Register() {
  const form = useForm<z.infer<typeForm>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeForm>) {
    const { username, password } = values;
    authService
      .register({ username, password })
      .then(() => {
        console.log("Registration successful");
      })
      .catch((error) => {
        console.error("Registration failed:", error);
      });
  }

  const username = form.watch("username");
  const debouncedUsername = useDebounce(username, 1000);
  useEffect(() => {
    if (!debouncedUsername) return;
    console.log("Checking username availability:", debouncedUsername);
    authService
      .checkUserNameAvailable(debouncedUsername)
      .then((isAvailable) => {
        if (!isAvailable) {
          form.setError("username", {
            type: "manual",
            message: "Username is already taken",
          });
        } else {
          form.clearErrors("username");
        }
      })
      .catch((error) => {
        console.error("Error checking username availability:", error);
      });
  }, [debouncedUsername]);

  return (
    <>
      <Link to={"/register"}>
        {" "}
        <p className="text-left text-muted-foreground">
          Don't have an account yet?
        </p>
      </Link>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10">
          <FormField
            //control acts as between react hook form and the UI custom component
            // bcz we cannot directly register the custom component with ( ...register )
            control={form.control}
            name="username"
            render={({ field }) => (
              // field is a prop that contains properties like :
              // onChange, onBlur, name, value, ref
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    className="py-6"
                    placeholder="my-username123"
                    type=""
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-left">
                  Enter your username.
                </FormDescription>
                <FormMessage className="text-left" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput className="py-6" {...field} />
                </FormControl>
                <FormDescription className="text-left">
                  Enter your password.
                </FormDescription>
                <FormMessage className="text-left" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput className="py-6" {...field} />
                </FormControl>
                <FormDescription className="text-left">
                  Confirm your password.
                </FormDescription>
                <FormMessage className="text-left" />
              </FormItem>
            )}
          />

          <Button type="submit">Register</Button>
        </form>
      </Form>
    </>
  );
}
