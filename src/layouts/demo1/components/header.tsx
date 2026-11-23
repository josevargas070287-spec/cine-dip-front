import { useEffect } from 'react';
import { UserDropdownMenu } from '@/partials/topbar/user-dropdown-menu';
import {

  Clapperboard,
} from 'lucide-react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { Container } from '@/components/common/container';
import { MegaMenu } from './mega-menu';


export function Header() {

  const { pathname } = useLocation();
  const mobileMode = useIsMobile();

  const scrollPosition = useScrollPosition();
  const headerSticky: boolean = scrollPosition > 0;

  // Close sheet when route changes
  useEffect(() => {
  }, [pathname]);

  return (
    <header
      className={cn(
        'header fixed top-0 z-10 start-0 flex items-stretch shrink-0 border-b border-transparent bg-background end-0 pe-[var(--removed-body-scroll-bar-size,0px)]',
        headerSticky && 'border-b border-border',
      )}
    >
      <Container className="flex justify-between items-stretch lg:gap-4">
        {/* HeaderLogo */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <Clapperboard className="size-6 text-amber-500" />
            <span className="text-lg font-bold tracking-wide text-foreground">
              CINÉLUX
            </span>
          </Link>

          <div className="flex items-center">
            {/* Conserva aquí los dos bloques Sheet existentes */}
          </div>
        </div>

        {/* Main Content */}
        {!mobileMode && <MegaMenu />}

        {/* HeaderTopbar */}
        <div className="flex items-center gap-3">
          <UserDropdownMenu
            trigger={
              <img
                className="size-9 rounded-full border-2 border-success shrink-0 cursor-pointer"
                src={toAbsoluteUrl('/media/avatars/300-2.png')}
                alt="User Avatar"
              />
            }
          />
        </div>
      </Container>
    </header>
  );
}