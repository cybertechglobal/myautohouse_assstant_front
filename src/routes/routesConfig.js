import CompanyGroups from '../pages/CompanyGroups';
import Companies from '../pages/Companies';
import CompanyDetails from '../pages/CompanyDetails';
import CompanyGroupDetails from '../pages/CompanyGroupDetails';
import Voices from '../pages/Voices';
import Conversations from '../pages/Conversations';
import LoginPage from '../pages/LoginPage';
import AssistantDetails from '../pages/AssistantDetails';
import Assistants from '../pages/Assistants';
import Events from '../pages/Events';
import DataCollectionEntriesPage from '../pages/DataCollectionEntries';
import SummariesPage from '../pages/Summaries';
import Settings from '../pages/Settings';
import Packages from '../pages/Package';
import Features from '../pages/Features';

export const routesConfig = [
  {
    path: '/company-groups',
    element: CompanyGroups,
    protected: true,
    roles: ['root'],
    layout: 'dashboard',
  },
  {
    path: '/company-groups/:companyGroupId',
    element: CompanyGroupDetails,
    protected: true,
    roles: ['root'],
    layout: 'dashboard',
  },
  {
    path: '/companies',
    element: Companies,
    protected: true,
    roles: ['root', 'group_admin'],
    layout: 'dashboard',
  },
  {
    path: '/companies/:companyId',
    element: CompanyDetails,
    protected: true,
    roles: ['root', 'group_admin'],
    layout: 'dashboard',
  },
  {
    path: '/event-logs',
    element: Events,
    protected: true,
    roles: ['root'],
    layout: 'dashboard',
  },
  {
    path: '/packages',
    element: Packages,
    protected: true,
    roles: ['root'],
    layout: 'dashboard',
  },
    {
    path: '/features',
    element: Features,
    protected: true,
    roles: ['root'],
    layout: 'dashboard',
  },
  {
    path: '/assistants',
    element: Assistants,
    protected: true,
    roles: ['admin'],
    layout: 'dashboard',
  },
  {
    path: '/settings',
    element: Settings,
    protected: true,
    roles: ['admin'],
    layout: 'dashboard',
  },
  {
    path: '/summaries',
    element: SummariesPage,
    protected: true,
    roles: ['admin'],
    layout: 'dashboard',
  },
  {
    path: '/companies/:companyId/assistants/:assistantId',
    element: AssistantDetails,
    protected: true,
    roles: ['root'],
    layout: 'dashboard',
  },
  {
    path: '/voices',
    element: Voices,
    protected: true,
    roles: ['root'],
    layout: 'dashboard',
  },
  {
    path: '/conversations',
    element: Conversations,
    protected: true,
    roles: ['root'],
    layout: 'dashboard',
  },
  {
    path: '/login',
    element: LoginPage,
    protected: false,
  },
  {
    path: '/companies/:companyId/data-collections/:collectionId/entries',
    element: DataCollectionEntriesPage,
    protected: true,
    roles: ['root', 'group_admin', 'admin'],
    layout: 'dashboard',
  },
];
