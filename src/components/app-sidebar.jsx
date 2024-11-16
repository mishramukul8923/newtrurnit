"use client"

import * as React from "react"
import Image from "next/image" // Import Next.js Image component
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavDash } from "./nav-dash"
// import { NavDash } from "./nav-dash"

import DecodeTokenEmail from "@/utils/DecodeTokenEmail"
import FetchUserDetails from "@/utils/FetchUserDetails"
import { useState, useEffect } from "react"
import { LuHistory } from "react-icons/lu"



const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [

    {
      title: "Humanizer",
      url: "/dashboard/humanizer",
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
        <g clipPath="url(#clip0_722_5876)">
          <path d="M17.9729 15.3792H17.1927C15.5092 15.3792 13.8964 14.8602 12.5289 13.8781L11.8948 13.4228C11.8705 13.4054 11.8478 13.3859 11.8268 13.3646C10.4505 11.9677 9.69258 10.1185 9.69258 8.15734C9.69258 7.49739 9.15568 6.96044 8.49569 6.96044C7.83577 6.96044 7.29883 7.49735 7.29883 8.15734C7.29883 8.95764 7.3953 9.7534 7.58556 10.5225C7.65552 10.8052 7.48305 11.0911 7.20032 11.1611C6.91738 11.2309 6.63167 11.0585 6.56178 10.7758C6.35102 9.92394 6.24414 9.04292 6.24414 8.15737C6.24414 6.91583 7.25418 5.90579 8.49569 5.90579C9.7372 5.90579 10.7473 6.91583 10.7473 8.15737C10.7473 9.82505 11.3861 11.3984 12.5472 12.5929L13.1441 13.0215C14.3313 13.874 15.7313 14.3245 17.1927 14.3245H17.9729C18.2642 14.3245 18.5003 14.5606 18.5003 14.8519C18.5003 15.1431 18.2642 15.3792 17.9729 15.3792Z" fill="#F4F4F5" />
          <path d="M16.0557 17.9301H15.2707C13.7609 17.9301 12.2699 17.5421 10.9588 16.808C9.63721 16.0681 8.53303 14.995 7.7656 13.7048C7.61671 13.4545 7.69894 13.1309 7.94926 12.982C8.1995 12.833 8.52318 12.9153 8.67207 13.1656C9.34499 14.2969 10.3139 15.2382 11.4741 15.8877C12.6281 16.5338 13.9409 16.8754 15.2707 16.8754H16.0558C16.347 16.8754 16.5831 17.1115 16.5831 17.4027C16.5831 17.6939 16.347 17.9301 16.0557 17.9301Z" fill="#F4F4F5" />
          <path d="M17.9729 12.5606H17.0204C15.8634 12.5606 14.7653 12.1212 13.9285 11.3234C13.0854 10.5196 12.6032 9.44154 12.5706 8.28785C12.5694 8.24475 12.5687 8.20123 12.5687 8.1576C12.5687 5.91168 10.7416 4.0845 8.49568 4.0845C7.2123 4.0845 6.02993 4.67116 5.25178 5.69399C5.0754 5.92585 4.74451 5.97074 4.51276 5.7944C4.28098 5.61805 4.23601 5.2872 4.41239 5.05541C5.3917 3.7681 6.87997 3.02982 8.49565 3.02982C11.3231 3.02982 13.6234 5.33012 13.6234 8.1576C13.6234 8.19114 13.6239 8.22457 13.6249 8.2579C13.6495 9.13192 14.0158 9.94945 14.6563 10.5601C15.296 11.17 16.1356 11.5059 17.0204 11.5059H17.9729C18.2641 11.5059 18.5002 11.742 18.5002 12.0333C18.5002 12.3245 18.2641 12.5606 17.9729 12.5606Z" fill="#F4F4F5" />
          <path d="M7.66848 17.9302C7.53165 17.9302 7.39496 17.8773 7.29164 17.7718C4.87461 15.3034 3.48372 12.0447 3.37527 8.59617C3.36609 8.30508 3.59464 8.06166 3.88577 8.05252C4.17686 8.04383 4.42029 8.27193 4.42943 8.56302C4.52959 11.7466 5.8137 14.7549 8.04528 17.0339C8.24905 17.242 8.2455 17.5759 8.03741 17.7797C7.93479 17.8802 7.80161 17.9302 7.66848 17.9302Z" fill="#F4F4F5" />
          <path d="M15.9721 8.68423C15.6809 8.68423 15.4448 8.44812 15.4448 8.15689C15.4448 6.34497 14.7514 4.62984 13.4925 3.32747C12.2376 2.02936 10.5554 1.27832 8.75505 1.21233L8.71929 1.2117C7.86088 1.19641 7.01312 1.32564 6.19866 1.59596C4.90519 2.0487 3.78216 2.86861 2.95061 3.96721C2.1038 5.08602 1.62089 6.41845 1.55417 7.82037C1.5407 8.10275 1.30751 8.32265 1.02781 8.32265C1.01937 8.32265 1.0109 8.32244 1.00228 8.32202C0.711402 8.30817 0.486788 8.06112 0.500605 7.7702C0.577527 6.15495 1.13394 4.61978 2.10967 3.33067C3.06778 2.0648 4.36276 1.12019 5.85462 0.598927C5.85712 0.598048 5.85965 0.597205 5.86218 0.596361C6.79136 0.287408 7.75942 0.139857 8.73807 0.157154L8.7786 0.157892C8.78184 0.157927 8.78504 0.158033 8.78823 0.158138C10.8643 0.232845 12.8042 1.09808 14.2507 2.59443C15.7008 4.09451 16.4994 6.06994 16.4994 8.15689C16.4995 8.44812 16.2634 8.68423 15.9721 8.68423Z" fill="#F4F4F5" />
          <path d="M3.19632 16.772C3.01478 16.772 2.83815 16.6782 2.74013 16.51C1.78037 14.8621 1.11778 13.0774 0.770646 11.2052C0.717561 10.9188 0.906666 10.6436 1.19305 10.5906C1.4795 10.5373 1.7546 10.7266 1.80769 11.0129C2.1326 12.7655 2.753 14.4364 3.65153 15.9792C3.79809 16.2309 3.71291 16.5537 3.46122 16.7003C3.37776 16.7489 3.28646 16.772 3.19632 16.772Z" fill="#F4F4F5" />
        </g>
        <defs>
          <clipPath id="clip0_722_5876">
            <rect width="18" height="18" fill="white" transform="translate(0.5 0.0442505)" />
          </clipPath>
        </defs>
      </svg>),
      isActive: true,
      items: [
        {
          title: "Donald  Thump",
          url: "#",
        },
        {
          title: "Charlie Bump",
          url: "#",
        },
        {
          title: "Charlie Bluster",
          url: "#",
        },
        {
          title: "See All",
          url: "/dashboard/historyhumanizer",
        },

      ],
    },
    {
      title: "Generate",
      url: "/dashboard/generate",
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
        <g clipPath="url(#clip0_722_5903)">
          <path d="M15.7507 3.78017L12.3608 0.57315C12.0003 0.232029 11.5283 0.0441895 11.032 0.0441895H4.57812C3.51194 0.0441895 2.64453 0.9116 2.64453 1.97778V16.1106C2.64453 17.1768 3.51194 18.0442 4.57812 18.0442H14.4219C15.4881 18.0442 16.3555 17.1768 16.3555 16.1106V5.18481C16.3555 4.65574 16.135 4.14376 15.7507 3.78017ZM14.7264 4.26294H12.1016C12.0046 4.26294 11.9258 4.18408 11.9258 4.08716V1.61342L14.7264 4.26294ZM14.4219 16.9895H4.57812C4.0935 16.9895 3.69922 16.5952 3.69922 16.1106V1.97778C3.69922 1.49315 4.0935 1.09888 4.57812 1.09888H10.8711V4.08716C10.8711 4.76564 11.4231 5.31763 12.1016 5.31763H15.3008V16.1106C15.3008 16.5952 14.9065 16.9895 14.4219 16.9895Z" fill="#F4F4F5" />
          <path d="M13.2617 7.07544H5.52734C5.23611 7.07544 5 7.31155 5 7.60278C5 7.89402 5.23611 8.13013 5.52734 8.13013H13.2617C13.553 8.13013 13.7891 7.89402 13.7891 7.60278C13.7891 7.31155 13.553 7.07544 13.2617 7.07544Z" fill="#F4F4F5" />
          <path d="M13.2617 9.88794H5.52734C5.23611 9.88794 5 10.124 5 10.4153C5 10.7065 5.23611 10.9426 5.52734 10.9426H13.2617C13.553 10.9426 13.7891 10.7065 13.7891 10.4153C13.7891 10.124 13.553 9.88794 13.2617 9.88794Z" fill="#F4F4F5" />
          <path d="M8.08391 12.7004H5.52734C5.23611 12.7004 5 12.9365 5 13.2278C5 13.519 5.23611 13.7551 5.52734 13.7551H8.08391C8.37514 13.7551 8.61125 13.519 8.61125 13.2278C8.61125 12.9365 8.37514 12.7004 8.08391 12.7004Z" fill="#F4F4F5" />
        </g>
        <defs>
          <clipPath id="clip0_722_5903">
            <rect width="18" height="18" fill="white" transform="translate(0.5 0.0442505)" />
          </clipPath>
        </defs>
      </svg>),
      items: [
        {
          title: "Donald  Thump",
          url: "#",
        },
        {
          title: "Charlie Bump",
          url: "#",
        },
        {
          title: "Charlie Bluster",
          url: "#",
        },
        {
          title: "See All",
          url: "/dashboard/historygenerate",
        },
      ],
    },

  ],
  navSecondary: [
    // {
    //   title: "Support",
    //   url: "#",
    //   icon: LifeBuoy,
    // },
    // {
    //   title: "Feedback",
    //   url: "#",
    //   icon: Send,
    // },
  ],
  projects: [
    {
      name: "History",
      url: "/dashboard/history",
      icon: <LuHistory />,
    },

    {
      name: "Insert Your Key",
      url: "/dashboard/apikey",
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
        <g clipPath="url(#clip0_722_5918)">
          <path d="M14.678 4.70971C14.678 2.40432 12.8051 0.528854 10.5032 0.528854C8.19785 0.528854 6.32227 2.40432 6.32227 4.70971C6.32227 6.37014 7.3273 7.88522 8.84398 8.54385V11.543C8.84398 11.9562 9.17879 12.2923 9.59625 12.2923C9.67988 12.2923 9.74797 12.363 9.74797 12.45V13.11C9.74797 13.197 9.67988 13.2677 9.59027 13.2677C9.17879 13.2677 8.84398 13.6039 8.84398 14.0169V14.5939C8.84398 15.007 9.17879 15.3431 9.59625 15.3431C9.67988 15.3431 9.74797 15.4125 9.74797 15.4978V16.1608C9.74797 16.2478 9.67988 16.3185 9.59027 16.3185C9.17879 16.3185 8.84398 16.6533 8.84398 17.0648V17.9063C8.84398 17.9855 8.87551 18.0614 8.93168 18.1171C9.25594 18.4396 9.41945 18.6033 10.2869 19.4725C10.4023 19.5882 10.59 19.5888 10.7062 19.4737C11.0378 19.1459 11.2364 18.9476 12.0687 18.1172C12.1249 18.0614 12.1564 17.9855 12.1564 17.9064V8.54397C13.673 7.88725 14.678 6.37217 14.678 4.70971ZM11.7548 8.06499C11.6386 8.10854 11.5617 8.21948 11.5617 8.34346V17.7829C11.5315 17.813 10.7118 18.6307 10.4983 18.8425C9.9425 18.2856 9.69418 18.0371 9.43867 17.7828V17.0648C9.43867 16.9812 9.50664 16.9132 9.59621 16.9132C10.0079 16.9132 10.3427 16.5757 10.3427 16.1608V15.4979C10.3427 15.0847 10.0079 14.7484 9.59027 14.7484C9.50664 14.7484 9.43871 14.6791 9.43871 14.5939V14.0169C9.43871 13.9302 9.50535 13.8624 9.59625 13.8624C10.0079 13.8624 10.3427 13.5248 10.3427 13.11V12.45C10.3427 12.0352 10.0079 11.6976 9.59031 11.6976C9.50539 11.6976 9.43875 11.6296 9.43875 11.543V8.34346C9.43875 8.2196 9.36195 8.1087 9.24594 8.06514C7.85297 7.54159 6.91703 6.19315 6.91703 4.70971C6.91703 2.73233 8.52578 1.12358 10.5033 1.12358C12.4774 1.12358 14.0834 2.73233 14.0834 4.70971C14.0833 6.19503 13.1475 7.54342 11.7548 8.06499Z" fill="white" />
          <path d="M10.5002 2.25058C9.94285 2.25058 9.48926 2.70546 9.48926 3.2646C9.48926 3.82199 9.94285 4.27558 10.5002 4.27558C11.0576 4.27558 11.5112 3.82199 11.5112 3.2646C11.5112 2.70546 11.0576 2.25058 10.5002 2.25058ZM10.5002 3.68085C10.2707 3.68085 10.0839 3.49413 10.0839 3.26456C10.0839 3.03343 10.2707 2.84523 10.5002 2.84523C10.7298 2.84523 10.9165 3.03339 10.9165 3.26456C10.9165 3.49413 10.7298 3.68085 10.5002 3.68085Z" fill="white" />
          <path d="M13.3266 10.9656H15.7882C15.9525 10.9656 16.0856 10.8325 16.0856 10.6683V8.66205C16.4245 8.53979 16.6687 8.21889 16.6687 7.83936C16.6687 7.35385 16.2736 6.95877 15.7881 6.95877C15.3026 6.95877 14.9075 7.35385 14.9075 7.83936C14.9075 8.21897 15.1519 8.53994 15.4909 8.66213V10.371H13.3266C13.1624 10.371 13.0293 10.5041 13.0293 10.6683C13.0293 10.8325 13.1624 10.9656 13.3266 10.9656ZM15.7881 7.55346C15.9458 7.55346 16.074 7.68166 16.074 7.83936C16.074 7.99545 15.9458 8.12248 15.7881 8.12248C15.6304 8.12248 15.5022 7.99545 15.5022 7.83936C15.5022 7.68166 15.6304 7.55346 15.7881 7.55346Z" fill="white" />
          <path d="M15.7882 14.6861H13.3266C13.1624 14.6861 13.0293 14.8192 13.0293 14.9834C13.0293 15.1477 13.1624 15.2808 13.3266 15.2808H15.4909V16.9898C15.1519 17.1123 14.9075 17.4344 14.9075 17.8151C14.9075 18.2992 15.3026 18.693 15.7881 18.693C16.2736 18.693 16.6687 18.2992 16.6687 17.8151C16.6687 17.4345 16.4245 17.1125 16.0856 16.9898V14.9834C16.0856 14.8192 15.9525 14.6861 15.7882 14.6861ZM15.7881 18.0983C15.6304 18.0983 15.5022 17.9713 15.5022 17.8152C15.5022 17.6575 15.6304 17.5293 15.7881 17.5293C15.9458 17.5293 16.074 17.6575 16.074 17.8152C16.074 17.9713 15.9458 18.0983 15.7881 18.0983Z" fill="white" />
          <path d="M19.1348 11.9468C18.7546 11.9468 18.4329 12.1905 18.3099 12.5288H13.3266C13.1624 12.5288 13.0293 12.6619 13.0293 12.8261C13.0293 12.9903 13.1624 13.1235 13.3266 13.1235H18.3094C18.4319 13.4615 18.7539 13.7053 19.1348 13.7053C19.6203 13.7053 20.0154 13.3115 20.0154 12.8274C20.0154 12.3419 19.6203 11.9468 19.1348 11.9468ZM19.1348 13.1106C18.9771 13.1106 18.8489 12.9835 18.8489 12.8274C18.8489 12.6698 18.9771 12.5415 19.1348 12.5415C19.2925 12.5415 19.4207 12.6698 19.4207 12.8274C19.4207 12.9835 19.2925 13.1106 19.1348 13.1106Z" fill="white" />
          <path d="M5.21148 10.9656H7.67309C7.8373 10.9656 7.97043 10.8325 7.97043 10.6683C7.97043 10.5041 7.8373 10.371 7.67309 10.371H5.50883V8.66213C5.84785 8.53994 6.09223 8.21897 6.09223 7.83936C6.09223 7.35385 5.69715 6.95877 5.21164 6.95877C4.72613 6.95877 4.33105 7.35385 4.33105 7.83936C4.33105 8.21889 4.57527 8.53979 4.91414 8.66205V10.6683C4.91414 10.8325 5.04727 10.9656 5.21148 10.9656ZM5.21164 7.55346C5.36934 7.55346 5.49754 7.68166 5.49754 7.83936C5.49754 7.99545 5.36934 8.12248 5.21164 8.12248C5.05395 8.12248 4.92574 7.99545 4.92574 7.83936C4.92574 7.68166 5.05395 7.55346 5.21164 7.55346Z" fill="white" />
          <path d="M7.67309 15.2808C7.8373 15.2808 7.97043 15.1477 7.97043 14.9835C7.97043 14.8193 7.8373 14.6861 7.67309 14.6861H5.21148C5.04727 14.6861 4.91414 14.8193 4.91414 14.9835V16.9899C4.57527 17.1126 4.33105 17.4345 4.33105 17.8152C4.33105 18.2993 4.72613 18.693 5.21164 18.693C5.69715 18.693 6.09223 18.2993 6.09223 17.8152C6.09223 17.4344 5.84785 17.1124 5.50883 16.9898V15.2809H7.67309V15.2808ZM5.21164 18.0983C5.05395 18.0983 4.92574 17.9712 4.92574 17.8152C4.92574 17.6575 5.05395 17.5293 5.21164 17.5293C5.36934 17.5293 5.49754 17.6575 5.49754 17.8152C5.49754 17.9712 5.36934 18.0983 5.21164 18.0983Z" fill="white" />
          <path d="M1.86492 13.7053C2.24578 13.7053 2.56785 13.4616 2.69035 13.1235H7.67309C7.8373 13.1235 7.97043 12.9903 7.97043 12.8261C7.97043 12.6619 7.8373 12.5288 7.67309 12.5288H2.68984C2.56688 12.1905 2.24516 11.9468 1.86496 11.9468C1.37945 11.9468 0.984375 12.3419 0.984375 12.8274C0.984336 13.3115 1.37941 13.7053 1.86492 13.7053ZM1.86492 12.5415C2.02262 12.5415 2.15082 12.6698 2.15082 12.8274C2.15082 12.9835 2.02262 13.1106 1.86492 13.1106C1.70723 13.1106 1.57902 12.9835 1.57902 12.8274C1.57906 12.6698 1.70727 12.5415 1.86492 12.5415Z" fill="white" />
        </g>
        <defs>
          <clipPath id="clip0_722_5918">
            <rect width="20" height="20" fill="white" transform="translate(0.5 0.0442505)" />
          </clipPath>
        </defs>
      </svg>),
    },
    {
      name: "Pricing",
      url: "/dashboard/pricing-plan",
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
        <g clipPath="url(#clip0_734_2601)">
          <path d="M18.3947 7.57643C18.6104 7.01123 18.4913 6.34649 18.0366 5.89178L12.6517 0.506863C12.0348 -0.109989 11.0311 -0.109918 10.4143 0.506863L4.3604 6.56084H2.08203C1.2097 6.56084 0.5 7.27054 0.5 8.14287V16.4614C0.5 17.3338 1.2097 18.0435 2.08203 18.0435H16.918C17.7903 18.0435 18.5 17.3338 18.5 16.4614V8.14287C18.5 7.94329 18.4625 7.75243 18.3947 7.57643ZM17.2494 6.59603C17.1424 6.57314 17.0316 6.56084 16.918 6.56084H15.7753L16.4947 5.8414L17.2494 6.59603ZM15.749 5.09563L14.2837 6.56084H12.7921L15.0031 4.34983L15.749 5.09563ZM11.1601 1.25263C11.263 1.14984 11.398 1.0984 11.5331 1.0984C11.6681 1.0984 11.8031 1.14984 11.9059 1.25263L14.2574 3.60409L11.3006 6.56087H5.85191L11.1601 1.25263ZM17.4453 16.4614C17.4453 16.7522 17.2087 16.9888 16.918 16.9888H2.08203C1.79125 16.9888 1.55469 16.7522 1.55469 16.4614V8.14287C1.55469 7.85209 1.79125 7.61553 2.08203 7.61553H16.918C17.2087 7.61553 17.4453 7.85209 17.4453 8.14287V16.4614Z" fill="#F4F4F5" />
          <path d="M2.57422 14.3382H5.03175V15.3929H2.57422V14.3382Z" fill="#F4F4F5" />
          <path d="M6.37207 14.3382H8.82956V15.3929H6.37207V14.3382Z" fill="#F4F4F5" />
          <path d="M10.1699 14.3382H12.6274V15.3929H10.1699V14.3382Z" fill="#F4F4F5" />
          <path d="M13.9688 14.3382H16.4263V15.3929H13.9688V14.3382Z" fill="#F4F4F5" />
          <path d="M5.29064 9.02171H3.48828C3.00365 9.02171 2.60938 9.41599 2.60938 9.90062V11.3069C2.60938 11.7915 3.00365 12.1858 3.48828 12.1858H5.29064C5.77527 12.1858 6.16954 11.7915 6.16954 11.3069V9.90062C6.16954 9.41599 5.77527 9.02171 5.29064 9.02171ZM5.11486 11.1311H3.66406V10.0764H5.11486V11.1311Z" fill="#F4F4F5" />
        </g>
        <defs>
          <clipPath id="clip0_734_2601">
            <rect width="18" height="18" fill="white" transform="translate(0.5 0.0442505)" />
          </clipPath>
        </defs>
      </svg>),
    },
    {
      name: "Transactions",
      url: "/dashboard/transactions",
      icon: <LuHistory />,
    },
    {
      name: "Account",
      url: "/dashboard/dashaccount",
      icon: (<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
        <g clipPath="url(#clip0_961_396)">
          <path d="M9.37161 8.7149C10.5628 8.7149 11.5941 8.28767 12.4371 7.44475C13.2797 6.60196 13.7071 5.57076 13.7071 4.37943C13.7071 3.18851 13.2799 2.15717 12.4369 1.3141C11.594 0.471451 10.5627 0.04422 9.37161 0.04422C8.18028 0.04422 7.14908 0.471451 6.30629 1.31424C5.4635 2.15703 5.03613 3.18837 5.03613 4.37943C5.03613 5.57076 5.4635 6.6021 6.30629 7.44489C7.14935 8.28754 8.18069 8.7149 9.37161 8.7149ZM7.05226 2.06007C7.69894 1.41339 8.45755 1.09904 9.37161 1.09904C10.2855 1.09904 11.0443 1.41339 11.6911 2.06007C12.3378 2.70689 12.6523 3.46564 12.6523 4.37943C12.6523 5.29349 12.3378 6.05209 11.6911 6.69891C11.0443 7.34573 10.2855 7.66008 9.37161 7.66008C8.45782 7.66008 7.69922 7.3456 7.05226 6.69891C6.40544 6.05223 6.09096 5.29349 6.09096 4.37943C6.09096 3.46564 6.40544 2.70689 7.05226 2.06007Z" fill="white"/>
          <path d="M16.9577 13.8854C16.9333 13.5346 16.8842 13.152 16.8118 12.748C16.7388 12.341 16.6447 11.9562 16.5321 11.6045C16.4156 11.241 16.2576 10.882 16.0619 10.538C15.859 10.1809 15.6206 9.87 15.3531 9.61415C15.0734 9.3465 14.7309 9.1313 14.3348 8.97433C13.9401 8.81819 13.5027 8.73909 13.0349 8.73909C12.8511 8.73909 12.6734 8.81448 12.3302 9.03792C12.119 9.17566 11.8719 9.33496 11.5962 9.51115C11.3604 9.66139 11.041 9.80215 10.6464 9.9296C10.2615 10.0542 9.87065 10.1173 9.48476 10.1173C9.09914 10.1173 8.7083 10.0542 8.32309 9.9296C7.92896 9.80229 7.60939 9.66153 7.37401 9.51129C7.10086 9.33675 6.85367 9.17744 6.6393 9.03778C6.29639 8.81435 6.11868 8.73895 5.93494 8.73895C5.46692 8.73895 5.02966 8.81819 4.63512 8.97447C4.23933 9.13116 3.8967 9.34636 3.61668 9.61429C3.34917 9.87027 3.11076 10.181 2.90807 10.538C2.71265 10.882 2.55444 11.2408 2.43799 11.6046C2.32552 11.9563 2.23145 12.341 2.15839 12.748C2.08588 13.1515 2.03685 13.5342 2.01254 13.8858C1.98865 14.2295 1.97656 14.5872 1.97656 14.9487C1.97656 15.8883 2.27525 16.649 2.86426 17.21C3.44598 17.7635 4.21558 18.0442 5.15175 18.0442H13.8189C14.7548 18.0442 15.5244 17.7635 16.1062 17.21C16.6954 16.6494 16.994 15.8884 16.994 14.9486C16.9939 14.5859 16.9817 14.2281 16.9577 13.8854ZM15.3789 16.4457C14.9945 16.8116 14.4842 16.9894 13.8187 16.9894H5.15175C4.48611 16.9894 3.9758 16.8116 3.59155 16.4459C3.21458 16.087 3.03139 15.5972 3.03139 14.9487C3.03139 14.6114 3.04251 14.2784 3.06476 13.9587C3.08646 13.645 3.13081 13.3005 3.19659 12.9344C3.26155 12.5728 3.34422 12.2334 3.44255 11.9262C3.5369 11.6317 3.66557 11.34 3.82515 11.059C3.97745 10.7912 4.15268 10.5614 4.34604 10.3763C4.5269 10.2032 4.75487 10.0614 5.02348 9.95514C5.27191 9.85681 5.5511 9.80298 5.85419 9.79488C5.89113 9.81451 5.95691 9.85201 6.06348 9.92149C6.28032 10.0628 6.53026 10.224 6.80656 10.4005C7.11803 10.5991 7.5193 10.7784 7.99872 10.9332C8.48885 11.0917 8.98872 11.1721 9.48489 11.1721C9.98106 11.1721 10.4811 11.0917 10.9709 10.9333C11.4508 10.7783 11.8519 10.5991 12.1638 10.4002C12.4465 10.2195 12.6895 10.0629 12.9063 9.92149C13.0129 9.85214 13.0787 9.81451 13.1156 9.79488C13.4188 9.80298 13.698 9.85681 13.9466 9.95514C14.2151 10.0614 14.443 10.2033 14.6239 10.3763C14.8172 10.5613 14.9925 10.7911 15.1448 11.0591C15.3045 11.34 15.4333 11.6318 15.5275 11.9261C15.626 12.2337 15.7088 12.5729 15.7736 12.9342C15.8392 13.301 15.8837 13.6457 15.9054 13.9588V13.9591C15.9278 14.2776 15.9391 14.6105 15.9392 14.9487C15.9391 15.5973 15.7559 16.087 15.3789 16.4457Z" fill="white"/>
        </g>
        <defs>
          <clipPath id="clip0_961_396">
            <rect width="18" height="18" fill="white" transform="translate(0.5 0.0442505)"/>
          </clipPath>
        </defs>
      </svg>),
    },
  ],
  navdash: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
          <path d="M3.5 3.79425C3.5 3.59534 3.57902 3.40457 3.71967 3.26392C3.86032 3.12327 4.05109 3.04425 4.25 3.04425H7.25C7.44891 3.04425 7.63968 3.12327 7.78033 3.26392C7.92098 3.40457 8 3.59534 8 3.79425V6.79425C8 6.99316 7.92098 7.18393 7.78033 7.32458C7.63968 7.46523 7.44891 7.54425 7.25 7.54425H4.25C4.05109 7.54425 3.86032 7.46523 3.71967 7.32458C3.57902 7.18393 3.5 6.99316 3.5 6.79425V3.79425Z" stroke="#F4F4F5" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 3.79425C11 3.59534 11.079 3.40457 11.2197 3.26392C11.3603 3.12327 11.5511 3.04425 11.75 3.04425H14.75C14.9489 3.04425 15.1397 3.12327 15.2803 3.26392C15.421 3.40457 15.5 3.59534 15.5 3.79425V6.79425C15.5 6.99316 15.421 7.18393 15.2803 7.32458C15.1397 7.46523 14.9489 7.54425 14.75 7.54425H11.75C11.5511 7.54425 11.3603 7.46523 11.2197 7.32458C11.079 7.18393 11 6.99316 11 6.79425V3.79425Z" stroke="#F4F4F5" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3.5 11.2943C3.5 11.0953 3.57902 10.9046 3.71967 10.7639C3.86032 10.6233 4.05109 10.5443 4.25 10.5443H7.25C7.44891 10.5443 7.63968 10.6233 7.78033 10.7639C7.92098 10.9046 8 11.0953 8 11.2943V14.2943C8 14.4932 7.92098 14.6839 7.78033 14.8246C7.63968 14.9652 7.44891 15.0443 7.25 15.0443H4.25C4.05109 15.0443 3.86032 14.9652 3.71967 14.8246C3.57902 14.6839 3.5 14.4932 3.5 14.2943V11.2943Z" stroke="#F4F4F5" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 11.2943C11 11.0953 11.079 10.9046 11.2197 10.7639C11.3603 10.6233 11.5511 10.5443 11.75 10.5443H14.75C14.9489 10.5443 15.1397 10.6233 15.2803 10.7639C15.421 10.9046 15.5 11.0953 15.5 11.2943V14.2943C15.5 14.4932 15.421 14.6839 15.2803 14.8246C15.1397 14.9652 14.9489 15.0443 14.75 15.0443H11.75C11.5511 15.0443 11.3603 14.9652 11.2197 14.8246C11.079 14.6839 11 14.4932 11 14.2943V11.2943Z" stroke="#F4F4F5" strokeWidth="1.125" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },


  ],
}

export function AppSidebar({ 
  ...props
}) {
  const [userData, setUserData] = useState(null);
  const [genHistory, setGenHistory] = useState([]);

  // Fetches user data based on the token in local storage
  const fetchUserId = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const email = DecodeTokenEmail(token);
        if (email) {
          let data = {
            _id: localStorage.getItem("userId"),
            name: localStorage.getItem("name"),
            email: email,
            image: localStorage.getItem("image"),
          }
          setUserData(data);  // Set user data with the first item from userDetails
        }
      }
    } catch (error) {
      console.error("Failed to fetch user ID:", error);
    }
  };

  // Fetches the latest 3 'text' values for the user from the generator history
  const generatorHistory = async () => {
    try {
      if (!userData?._id) return;  // Ensure userData is defined

      // Make a POST request to the '/api/history/generator' endpoint
      const response = await fetch('/api/history/humanizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userData._id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data:", errorData);
        throw new Error("Failed to fetch generator history");
      }
      else{
        const data = await response.json();
        setGenHistory(data?.data || []); // Update state with the fetched data
        console.log("Fetched generator history:", data);  
      }

      // Parse the response JSON and update genHistory
     

    } catch (error) {
      console.error("Error fetching generator history:", error);
    }
  };

  // useEffect to fetch user data on initial load
  useEffect(() => {
    fetchUserId();
  }, []);

  // useEffect to call generatorHistory once userData is set
   // useEffect to call generatorHistory with a 5-second delay after userData is set
   useEffect(() => {
    if (userData?._id != undefined) {
      const timer = setTimeout(() => {
        generatorHistory();  // Call generatorHistory after a delay
      }, 1000); // 5000 milliseconds = 5 seconds

      // Cleanup the timer on unmount or when userData changes
      return () => clearTimeout(timer);
    }
  }, [userData]);



  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <Image src="/images/turnit-logo.svg" alt="Open Menu" width={180} height={36} /> {/* Replace `fluid` with `width` and `height` */}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavDash items={data.navDash} />
        <NavDash navdash={data.navdash} />
        <NavMain items={genHistory} updateinfo={props.updateinfo } updategneinfo={props.updategneinfo}/>
        {/* <NavMain items={data.navMain}/> */}
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}