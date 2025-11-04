import type { IMenuItem } from "@/types/global.type";
import { BadgeQuestionMark, BookImage, BookOpenCheck, ChartBarStacked, Fingerprint, GlobeLock, GraduationCap, HandHelping, Handshake, HatGlasses, LayoutDashboard, Lock, MailCheck, MailQuestionMark, Newspaper, Ratio, SettingsIcon, TestTube, User, Users } from "lucide-react";
import { MdContactPhone } from "react-icons/md";

export const menuItems: IMenuItem[] = [
  { name: 'Dashboard', labelKey: 'sidebar.menu.dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Orders', labelKey: 'sidebar.menu.orders', icon: BookImage, href: '/orders' },
  { name: 'Training', labelKey: 'sidebar.menu.training', icon: GraduationCap, href: '/trainings' },
  { name: 'Users', labelKey: 'sidebar.menu.users', icon: Users, href: '/users' },
  { name: 'Companies', labelKey: 'sidebar.menu.companies', icon: Users, href: '/companies' },
  { name: 'Employees', labelKey: 'sidebar.menu.employees', icon: Users, href: '/employees' },
  { name: 'Category', labelKey: 'sidebar.menu.category', icon: ChartBarStacked , href: '/categories' },
  { name: 'Courses', labelKey: 'sidebar.menu.courses', icon: Ratio , href: '/courses' },
  {
    name: 'Test & Certificate',
    labelKey: 'sidebar.menu.testCertificate',
    icon: BookOpenCheck,
    submenu: [
      { name: 'Test Builder', labelKey: 'sidebar.menu.testBuilder', icon: TestTube , href: '/test-builder' },
      { name: 'Test Results', labelKey: 'sidebar.menu.testResults', icon: Newspaper, href: '/test-results' },
      { name: 'Certificate Templete', labelKey: 'sidebar.menu.certificateTemplate', icon: GraduationCap, href: '/certificate-template' },
      { name: 'Issued Certificates', labelKey: 'sidebar.menu.issuedCertificates', icon: HatGlasses, href: '/certificate-issued' },
    ]
  },
  { name: 'Contact List', labelKey: 'sidebar.menu.contactList', icon: MdContactPhone , href: '/contacts' },
  { name: 'Subscriber List', labelKey: 'sidebar.menu.subscriberList', icon: MailCheck , href: '/subscribers' },
  {
    name: 'Help & Support',
    labelKey: 'sidebar.menu.helpSupport',
    icon: BadgeQuestionMark,
    submenu: [
      { name: 'Help Center', labelKey: 'sidebar.menu.helpCenter', icon: HandHelping, href: '/help' },
      { name: 'FAQs', labelKey: 'sidebar.menu.faqs', icon: MailQuestionMark, href: '/faqs' },
    ]
  },
  {
    name: 'Settings',
    labelKey: 'sidebar.menu.settings',
    icon: SettingsIcon,
    submenu: [
      { name: 'Profile', labelKey: 'sidebar.menu.profile', icon: User, href: '/profile' },
      { name: 'Change Password', labelKey: 'sidebar.menu.changePassword', icon: Lock , href: '/change-password' },
      { name: 'About Us', labelKey: 'sidebar.menu.aboutUs', icon: Fingerprint, href: '/about-us' },
      { name: 'Privacy Policy', labelKey: 'sidebar.menu.privacyPolicy', icon: GlobeLock , href: '/privacy-policy' },
      { name: 'Terms & Condition', labelKey: 'sidebar.menu.termsCondition', icon: Handshake, href: '/terms-condition' },
    ]
  },
];
