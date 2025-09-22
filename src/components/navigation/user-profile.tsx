'use client';
import { useProfile } from "@/queries/use-account";

const UserProfile = () => {
    const { data: user, isLoading, error,  } = useProfile();
     
    if(isLoading) return <div>Loading...</div>;
    if(error) return <div>Error loading user profile</div>;
    return (
        <div className="user-profile">
            <span className="text-xs text-muted-foreground">
               
                { user?.email || 'Guest'}
            </span>
        </div>
    );
}

export default UserProfile;