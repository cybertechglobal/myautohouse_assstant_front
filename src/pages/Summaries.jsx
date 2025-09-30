import Summaries from "../components/summaries/summaries";
import { useAuthStore } from '../store/authStore';
import { getCompanyById } from '../api/companies';
import { Box } from "@mui/material";
import SectionHeader from "../components/common/page-header/SectionHeader";

export default function SummariesPage() {
  const currentUser = useAuthStore((state) => state.user);
  const companyId = currentUser.company.id;

  return (
    <Box p={4}>
      <SectionHeader
        title="Conversation Summaries"
      /><Summaries companyId={companyId} /></Box>

  );
}
