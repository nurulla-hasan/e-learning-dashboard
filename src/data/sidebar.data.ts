import type { IMenuItem } from "@/types/global.type";
import { BadgeQuestionMark, BookImage, BookOpenCheck, ChartBarStacked, Fingerprint, GlobeLock, GraduationCap, HandHelping, Handshake, HatGlasses, LayoutDashboard, Lock, MailCheck, MailQuestionMark, Newspaper, Ratio, SettingsIcon, TestTube, User, Users } from "lucide-react";
import { MdContactPhone } from "react-icons/md";

export const menuItems: IMenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Orders', icon: BookImage, href: '/orders' },
  { name: 'Users', icon: Users, href: '/users' },
  { name: 'Category', icon: ChartBarStacked , href: '/categories' },
  { name: 'Courses', icon: Ratio , href: '/courses' },
  {
    name: 'Test & Certificate', icon: BookOpenCheck,
    submenu: [
      { name: 'Test Builder', icon: TestTube , href: '/test-builder' },
      { name: 'Test Results', icon: Newspaper, href: '/test-results' },
      { name: 'Certificate Templete', icon: GraduationCap, href: '/certificate-template' },
      { name: 'Issued Certificates', icon: HatGlasses, href: '/certificate-issued' },
    ]
  },
  { name: 'Contact List', icon: MdContactPhone , href: '/contacts' },
  { name: 'Subscriber List', icon: MailCheck , href: '/subscribers' },
  {
    name: 'Help & Support', icon: BadgeQuestionMark,
    submenu: [
      { name: 'Help Center', icon: HandHelping, href: '/help' },
      { name: 'FAQs', icon: MailQuestionMark, href: '/faqs' },
    ]
  },
  {
    name: 'Settings',
    icon: SettingsIcon,
    submenu: [
      { name: 'Profile', icon: User, href: '/profile' },
      { name: 'Change Password', icon: Lock , href: '/change-password' },
      { name: 'About Us', icon: Fingerprint, href: '/about-us' },
      { name: 'Privacy Policy', icon: GlobeLock , href: '/privacy-policy' },
      { name: 'Terms & Condition', icon: Handshake, href: '/terms-condition' },
    ]
  },
];
