import { Home } from "lucide-react";
import { BsFillPatchQuestionFill } from "react-icons/bs";
import { GoGoal } from "react-icons/go";
import { FaRankingStar } from "react-icons/fa6";
import { SiQuizlet } from "react-icons/si";
import { usePathname } from "next/navigation";
export const Routes = () => {
  const pathname = usePathname();
  const adminRoutes = [
    {
      id: 1,
      title: "Dashboard",
      url: "/",
      icon: Home,
      active: false,
      isActive: pathname === "/",
    },
    {
      id: 2,
      title: "Quiz",
      url: "/quiz",
      icon: SiQuizlet,
      active: false,
      isActive: pathname.startsWith("/quiz"),
    },
    {
      id: 3,
      title: "Questions",
      url: "/questions",
      icon: BsFillPatchQuestionFill,
      active: false,
      isActive:
        pathname.startsWith("/questions") || pathname.startsWith("/options"),
      children: [
        {
          id: 3.1,
          title: "Questions",
          url: "/questions",
          active: false,
          isActive: pathname.startsWith("/questions"),
        },
        {
          id: 3.2,
          title: "Options",
          url: "/options",
          active: false,
          isActive: pathname.startsWith("/options"),
        },
      ],
    },
    {
      id: 4,
      title: "Attempts",
      url: "/attempts",
      icon: GoGoal,
      active: false,
      isActive: pathname.startsWith("/attempts"),
    },
    {
      id: 5,
      title: "Results",
      url: "/results",
      icon: FaRankingStar,
      active: false,
      isActive: pathname.startsWith("/results"),
    },
  ];

  return adminRoutes;
};
