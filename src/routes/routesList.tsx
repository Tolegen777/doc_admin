import { Empty } from 'antd';
import CalendarPage from "../pages/CalendarPage/CalendarPage.tsx";
import DoctorsPage from "../pages/DoctorsPage/DoctorsPage.tsx";
import VisitsPage from "../pages/VisitsPage/VisitsPage.tsx";
import {LoginPage} from "../pages/LoginPage/LoginPage.tsx";
import DoctorEditPage from "../pages/DoctorEditPage/DoctorEditPage.tsx";
import DoctorSurveyPage from "../pages/DoctorSurveyPage/DoctorSurveyPage.tsx";
import DailySummary from "../pages/DailySummary/DailySummary.tsx";
import MonthSummaryPage from "../pages/MonthSummaryPage/MonthSummaryPage.tsx";

export const routesList = [
  {
    path: '/empty',
    element: <Empty description="К сожалению, у вас отсутствуют необходимые права для доступа к административной панели." />,
  },
  {
    path: '/*',
    element: <CalendarPage />,
  },
  {
    path: '/calendar',
    element: <CalendarPage />,
  },
  {
    path: '/doctors',
    element: <DoctorsPage />,
  },
  {
    path: '/payment',
    element: <div></div>,
  },
  {
    path: '/reviews',
    element: <div></div>,
  },
  {
    path: '/doctor/:id',
    element: <DoctorEditPage />,
  },
  {
    path: '/doctor/:id/survey',
    element: <DoctorSurveyPage />,
  },
  {
    path: '/visits',
    element: <VisitsPage />,
  },
  {
    path: '/daily_summary',
    element: <DailySummary />,
  },
  {
    path: '/monthly_summary',
    element: <MonthSummaryPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
];
