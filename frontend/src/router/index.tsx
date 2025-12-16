import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import ProtectedRoute from './ProtectedRoute';

// Friend pages
import TodoPage from '../pages/app/TodoPage';
import MessagesPage from '../pages/app/MessagesPage';
import CountdownPage from '../pages/app/CountdownPage';
import PicturesPage from '../pages/app/PicturesPage';

// Admin pages
import AdminOverview from '../pages/admin/AdminOverview';
import AuditLogPage from '../pages/admin/AuditLogPage';
import FriendTodosPage from '../pages/admin/FriendTodosPage';
import FriendMessagesPage from '../pages/admin/FriendMessagesPage';
import PhotoReviewPage from '../pages/admin/PhotoReviewPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Friend routes */}
        <Route
          path="/app"
          element={<ProtectedRoute allowedRoles={['FRIEND']} />}
        >
          <Route index element={<Navigate to="/app/countdown" replace />} />
          <Route path="todos" element={<TodoPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="countdown" element={<CountdownPage />} />
          <Route path="pictures" element={<PicturesPage />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={['ADMIN']} />}
        >
          <Route index element={<Navigate to="/admin/overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="audit" element={<AuditLogPage />} />
          <Route path="friend-todos" element={<FriendTodosPage />} />
          <Route path="friend-messages" element={<FriendMessagesPage />} />
          <Route path="photos" element={<PhotoReviewPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
