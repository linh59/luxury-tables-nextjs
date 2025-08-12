'use client';
import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType } from "@/lib/schemaValidations/auth.schema";
import { setAccessTokenToLocalStorage } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: (body: LoginBodyType) => authApiRequest.login(body),
        onSuccess: (data) => {
            console.log('Login successful:', data);
            const p = data.payload;
            const token = p?.token ?? null;
            if (token) setAccessTokenToLocalStorage(token);
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
            // Handle successful logout, e.g., clear user data, redirect, etc.
            console.log('Logout successful');
        },
        onError: (error) => {
            // Handle logout error
            console.error('Logout failed:', error);
        }
    });
}