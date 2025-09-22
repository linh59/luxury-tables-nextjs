'use client';
import authApiRequest from "@/api-client/auth";
import { LoginBodyType } from "@/lib/schema-validations/auth.schema";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: (body: LoginBodyType) => authApiRequest.login(body),
        onSuccess: async (data) => {
            console.log('Login successful:', data);
        },
        onError: (error) => {
            // Handle login error
            console.error('Login failed:', error);
        }
    });
}

export const useLogoutMutiation = () => {
    return useMutation({
        mutationFn: () => authApiRequest.logout(),
        onSuccess: () => {
            console.log('Logout successful');
        },
        onError: (error) => {
            // Handle logout error
            console.error('Logout failed:', error);
        }
    });
}