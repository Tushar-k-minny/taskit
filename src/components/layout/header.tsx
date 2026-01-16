"use client";

import { Moon, SignOut, Sun } from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { signOut } from "@/lib/auth-client";

interface DashboardHeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    router.push("/");
    router.refresh();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-border border-b bg-card/80 px-6 backdrop-blur-sm lg:justify-end">
      {/* Spacer for mobile menu button */}
      <div className="w-10 lg:hidden" />

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <Button
          className="transition-transform duration-300 hover:rotate-12"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          size="icon"
          variant="ghost"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" weight="fill" />
          ) : (
            <Moon className="h-5 w-5" weight="fill" />
          )}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="relative h-10 w-10 rounded-full bg-secondary-foreground transition-all duration-200 hover:ring-2 hover:ring-primary/50"
              variant="ghost"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage alt={user.name} src={user.image || undefined} />
                <AvatarFallback className="text-accent-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleSignOut}
            >
              <SignOut className="mr-2 h-4 w-4" weight="bold" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
