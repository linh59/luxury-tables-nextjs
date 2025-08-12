import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType } from "@/lib/schemaValidations/auth.schema";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: (body: LoginBodyType) => authApiRequest.login(body),
        onSuccess: (data) => {
            // Handle successful login, e.g., store user data, redirect, etc.
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
            // Handle successful logout, e.g., clear user data, redirect, etc.
            console.log('Logout successful');
        },
        onError: (error) => {
            // Handle logout error
            console.error('Logout failed:', error);
        }
    }); 
}