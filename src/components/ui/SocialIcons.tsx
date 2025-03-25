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
      <path d="M12 1.5c-2.792 0-5.055 2.263-5.055 5.055C5.358 7.97 4.286 9.6 3.9 11.43c-.6 2.847.783 5.693 3.356 6.875 2.738 1.256 5.966.103 7.188-2.6.176-.387.502-.647.9-.67.399-.024.75.186.964.547 1.21 2.036 3.773 2.836 5.913 1.805 2.574-1.24 3.757-4.198 2.917-7.114-.471-1.635-1.571-3.026-2.997-3.825-.047-3.872-3.272-7.002-7.222-6.951zM7.889 16.185c-1.2 0-2.173-.973-2.173-2.172 0-1.2.973-2.173 2.173-2.173 1.2 0 2.173.973 2.173 2.173 0 1.199-.973 2.172-2.173 2.172m8.222 0c-1.2 0-2.173-.973-2.173-2.172 0-1.2.973-2.173 2.173-2.173 1.2 0 2.173.973 2.173 2.173 0 1.199-.973 2.172-2.173 2.172"></path>
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
