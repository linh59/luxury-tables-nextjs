import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext";
import { MoonIcon, SunIcon } from "lucide-react";

const LightDarkModeBtn = () =>{
      const { theme, toggleTheme } = useTheme();

    return(
          <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9"
              >
                {theme === 'light' ? (
                  <MoonIcon className="h-4 w-4" />
                ) : (
                  <SunIcon className="h-4 w-4" />
                )}
              </Button>
    )
}

export default LightDarkModeBtn