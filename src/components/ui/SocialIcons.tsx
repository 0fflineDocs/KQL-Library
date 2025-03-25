import React, { SVGProps } from 'react';

// Simple Icons collection for KQL Library
// Icons taken from: https://simpleicons.org/

export function Github(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
    </svg>
  );
}

export function Linkedin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <title>LinkedIn</title>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
    </svg>
  );
}

export function Mail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <title>Email</title>
      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"></path>
      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"></path>
    </svg>
  );
}

export function Twitter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <title>X (Twitter)</title>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path>
    </svg>
  );
}

export function Bluesky(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <title>Bluesky</title>
      <path d="M12.018 4.5c-4.5 0-7.603 3.944-9.565 7.44-.905 1.316-.507 3.109.804 4.013 1.279.872 3.023.506 3.935-.798.537-.798 1.279-1.612 2.272-2.15C8.996 13.23 7.84 15.853 7.04 18c-.266.725.537 1.343 1.073.872 3.227-2.797 4.37-5.946 4.37-5.946.072-.145.167-.29.276-.427.11.139.203.283.276.427 0 0 1.143 3.149 4.37 5.946.536.47 1.339-.147 1.073-.872-.8-2.148-1.955-4.77-2.423-5.047.993.538 1.735 1.352 2.271 2.15.913 1.304 2.657 1.67 3.935.798 1.311-.904 1.71-2.697.805-4.013-1.962-3.496-5.065-7.44-9.566-7.44ZM9.121 13.5c.805 0 1.475-.657 1.475-1.489 0-.832-.67-1.489-1.475-1.489-.805 0-1.475.657-1.475 1.489 0 .832.67 1.49 1.475 1.49Zm5.758 0c.805 0 1.476-.657 1.476-1.489 0-.832-.67-1.489-1.476-1.489-.805 0-1.475.657-1.475 1.489 0 .832.67 1.49 1.475 1.49Z"/>
    </svg>
  );
}

// Social icon component that allows for consistent styling and usage
interface SocialIconProps {
  type: 'github' | 'linkedin' | 'twitter' | 'mail' | 'bluesky';
  href: string;
  className?: string;
  size?: number;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ 
  type, 
  href, 
  className = '',
  size = 20
}) => {
  const IconComponent = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    mail: Mail,
    bluesky: Bluesky
  }[type];

  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-gray-400 hover:text-gray-300 p-2 rounded-full hover:bg-gray-800/50 inline-flex items-center justify-center ${className}`}
      title={type.charAt(0).toUpperCase() + type.slice(1)}
    >
      <IconComponent width={size} height={size} fill="currentColor" />
    </a>
  );
};

export default SocialIcon;
