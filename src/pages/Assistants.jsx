import AssistantList from '../components/assistants/AssistantList';
import { Box } from '@mui/material';

import { useAuthStore } from '../store/authStore';

export default function Assistants() {

  const currentUser = useAuthStore((state) => state.user);
  const companyId = currentUser.company.id;
  return (
    <Box p={4}>
      <AssistantList companyId={companyId} isSmallTitle={false}/>
    </Box>
    
  );
}
