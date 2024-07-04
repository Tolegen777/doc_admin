import { Empty } from 'antd';
import CalendarPage from "../pages/CalendarPage/CalendarPage.tsx";
import DoctorsPage from "../pages/DoctorsPage/DoctorsPage.tsx";
import VisitsPage from "../pages/VisitsPage/VisitsPage.tsx";
import {LoginPage} from "../pages/LoginPage/LoginPage.tsx";
import DoctorEditPage from "../pages/DoctorEditPage/DoctorEditPage.tsx";
import DoctorSurveyPage from "../pages/DoctorSurveyPage/DoctorSurveyPage.tsx";
import DailySummary from "../pages/DailySummary/DailySummary.tsx";
import MonthSummaryPage from "../pages/MonthSummaryPage/MonthSummaryPage.tsx";
import MonthSummaryByIdPage from "../pages/MonthSummaryByIdPage/MonthSummaryByIdPage.tsx";
import ReviewsPage from "../pages/ReviewsPage/ReviewsPage.tsx";

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
    element: <div style={{padding: 20, fontSize: 16}}>
      Страница еще в разработке...
    </div>,
  },
  {
    path: '/reviews',
    element: <ReviewsPage/>,
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
    path: '/monthly_summary/:id',
    element: <MonthSummaryByIdPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
];
