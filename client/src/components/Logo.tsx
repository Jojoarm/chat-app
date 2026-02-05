import { cn } from '@/lib/utils';
import DevChatLogo from '../assets/images/dev-chat_logo.png';
import { Link } from 'react-router-dom';

type LogoProps = {
  path?: string;
  showLogoText?: boolean;
  imgClass?: string;
  textClass?: string;
};

const Logo = ({
  path = '/',
  showLogoText = false,
  imgClass = 'size-[15px]',
  textClass,
}: LogoProps) => {
  return (
    <Link to={path} className="flex items-center gap-2 w-fit">
      <img src={DevChatLogo} alt="DevChat logo" className={cn(imgClass)} />
      {showLogoText && (
        <h2
          className={cn(
            'flex font-bold text-lg lg:text-xl leading-tight ',
            textClass,
          )}
        >
          <span className="text-primary">Dev</span>
          <span className="text-secondary">Chat</span>
        </h2>
      )}
    </Link>
  );
};

export default Logo;
