import { Empty } from "antd";
import CalendarPage from "../pages/CalendarPage/CalendarPage.tsx";
import DoctorsPage from "../pages/DoctorsPage/DoctorsPage.tsx";
import VisitsPage from "../pages/VisitsPage/VisitsPage.tsx";
import { LoginPage } from "../pages/LoginPage/LoginPage.tsx";
import DoctorEditPage from "../pages/DoctorEditPage/DoctorEditPage.tsx";
import DoctorSurveyPage from "../pages/DoctorSurveyPage/DoctorSurveyPage.tsx";
import DailySummary from "../pages/DailySummary/DailySummary.tsx";
import MonthSummaryPage from "../pages/MonthSummaryPage/MonthSummaryPage.tsx";
import MonthSummaryByIdPage from "../pages/MonthSummaryByIdPage/MonthSummaryByIdPage.tsx";
import ReviewsPage from "../pages/ReviewsPage/ReviewsPage.tsx";
import FranchisePage from "../pages/FranchisePage/FranchisePage.tsx";
import AmenitiesPage from "../pages/AmenityPage/AmenityPage.tsx";
import AllDoctorsPage from "../pages/AllDoctorsPage/AllDoctorsPage.tsx";
import AllDoctorEditPage from "../pages/AllDoctorEditPage/AllDoctorEditPage.tsx";
import DoctorsPage2 from "../pages/DoctorsPage2/DoctorsPage2.tsx";
import DoctorEditPage2 from "../pages/DoctorEditPage2/DoctorEditPage2.tsx";
import DescriptionFragmentPage from "../pages/DescriptionFragmentPage/DescriptionFragmentPage.tsx";
import AllDoctorWorkSchedulesPage from "../components/AllDoctors/AllDoctorWorkSchedulesPage/AllDoctorWorkSchedulesPage.tsx";
import AllDoctorPhotoPage from "../components/AllDoctors/AllDoctorPhotoPage/AllDoctorPhotoPage.tsx";
import { AllVisitsPage } from "../pages/AllVisitsPage/AllVisitsPage.tsx";
import { PatientDetailPage } from "../pages/PatientDetailPage/PatientDetailPage.tsx";
import { PatientVisitsPage } from "../pages/PatientVisitsPage/PatientVisitsPage.tsx";
import { PatientsPage } from "../pages/PatientsPage/PatientsPage.tsx";
import { VisitDetailPage } from "../pages/VisitDetailPage/VisitDetailPage.tsx";
import PaymentPage from "../pages/PaymentPage/PaymentPage";

export const routesList = [
  {
    path: "/empty",
    element: (
      <Empty description="К сожалению, у вас отсутствуют необходимые права для доступа к административной панели." />
    ),
  },
  {
    path: "/*",
    element: <CalendarPage />,
  },
  {
    path: "/calendar",
    element: <CalendarPage />,
  },
  {
    path: "/doctors",
    element: <DoctorsPage />,
  },
  {
    path: "/all-doctors",
    element: <DoctorsPage2 />,
  },
  {
    path: "/all-doctors/:id",
    element: <DoctorEditPage2 />,
  },
  {
    path: "/all-doctors/:id/survey",
    element: <AllDoctorEditPage />,
  },
  {
    path: "/all-doctors/:id/description",
    element: <DescriptionFragmentPage />,
  },
  {
    path: "/all-doctors/:id/schedule",
    element: <AllDoctorWorkSchedulesPage />,
  },
  {
    path: "/all-doctors/:id/photo",
    element: <AllDoctorPhotoPage />,
  },
  {
    path: "/all-doctors/create",
    element: <AllDoctorEditPage />,
  },
  {
    path: "/all2-doctors",
    element: <AllDoctorsPage />,
  },
  {
    path: "/payment",
    element: <PaymentPage />,
  },
  {
    path: "/reviews",
    element: <ReviewsPage />,
  },
  {
    path: "/doctor/:id",
    element: <DoctorEditPage />,
  },
  {
    path: "/all2-doctors/:id",
    element: <AllDoctorEditPage />,
  },
  {
    path: "/all2-doctors/create",
    element: <AllDoctorEditPage />,
  },
  {
    path: "/doctor/:id/survey",
    element: <DoctorSurveyPage />,
  },
  {
    path: "/visits",
    element: <VisitsPage />,
  },
  {
    path: "/franchises",
    element: <FranchisePage />,
  },
  {
    path: "/daily_summary",
    element: <DailySummary />,
  },
  {
    path: "/monthly_summary",
    element: <MonthSummaryPage />,
  },
  {
    path: "/monthly_summary/:id",
    element: <MonthSummaryByIdPage />,
  },
  {
    path: "/amenities",
    element: <AmenitiesPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  ///
  {
    path: "/all-visits",
    element: <AllVisitsPage />,
  },
  {
    path: "/visits/:id",
    element: <VisitDetailPage />,
  },
  {
    path: "/patients",
    element: <PatientsPage />,
  },
  {
    path: "/patients/:id",
    element: <PatientDetailPage />,
  },
  {
    path: "/patients/:id/visits",
    element: <PatientVisitsPage />,
  },
];
