import { Moon, Sun, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-white/40 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 text-yellow-500 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-500 text-blue-400 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={`cursor-pointer transition-all duration-200 ${theme === 'light' ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 dark:text-yellow-300' : 'hover:bg-accent/50'}`}
        >
          <Sun className="mr-3 h-4 w-4 text-yellow-500" />
          <span className="font-medium">Light Mode</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={`cursor-pointer transition-all duration-200 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 dark:text-blue-300' : 'hover:bg-accent/50'}`}
        >
          <Moon className="mr-3 h-4 w-4 text-blue-500" />
          <span className="font-medium">Dark Mode</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className={`cursor-pointer transition-all duration-200 ${theme === 'system' ? 'bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-700 dark:text-green-300' : 'hover:bg-accent/50'}`}
        >
          <Monitor className="mr-3 h-4 w-4 text-green-500" />
          <span className="font-medium">System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}