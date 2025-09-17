// Enhanced AuthContext that preserves existing functionality - FIXED VERSION
import React, { createContext, useContext, useState, useEffect } from 'react';

// User roles for LSS system
export const USER_ROLES = {
  ADMIN: 'admin',
  PROJECT_LEAD: 'project_lead',
  TEAM_MEMBER: 'team_member'
};

// Permissions for LSS system
export const PERMISSIONS = {
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  CONFIGURE_SYSTEM: 'configure_system',
  VIEW_ALL_PROJECTS: 'view_all_projects',
  MANAGE_TOLLGATES: 'manage_tollgates',
  
  // Project Lead permissions
  CREATE_PROJECTS: 'create_projects',
  MANAGE_OWN_PROJECTS: 'manage_own_projects',
  ACCESS_KANBAN: 'access_kanban',
  ASSIGN_TEAM_MEMBERS: 'assign_team_members',
  
  // Team Member permissions
  VIEW_ASSIGNED_PROJECTS: 'view_assigned_projects',
  EDIT_ARTIFACTS: 'edit_artifacts',
  SUBMIT_WORK: 'submit_work'
};

// Role permissions mapping
const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.CONFIGURE_SYSTEM,
    PERMISSIONS.VIEW_ALL_PROJECTS,
    PERMISSIONS.MANAGE_TOLLGATES,
    PERMISSIONS.CREATE_PROJECTS,
    PERMISSIONS.MANAGE_OWN_PROJECTS,
    PERMISSIONS.ASSIGN_TEAM_MEMBERS,
    PERMISSIONS.VIEW_ASSIGNED_PROJECTS,
    PERMISSIONS.EDIT_ARTIFACTS,
    PERMISSIONS.SUBMIT_WORK
    // Note: Admins don't get ACCESS_KANBAN - that's Project Lead only
  ],
  [USER_ROLES.PROJECT_LEAD]: [
    PERMISSIONS.CREATE_PROJECTS,
    PERMISSIONS.MANAGE_OWN_PROJECTS,
    PERMISSIONS.ACCESS_KANBAN,
    PERMISSIONS.ASSIGN_TEAM_MEMBERS,
    PERMISSIONS.VIEW_ASSIGNED_PROJECTS,
    PERMISSIONS.EDIT_ARTIFACTS,
    PERMISSIONS.SUBMIT_WORK
  ],
  [USER_ROLES.TEAM_MEMBER]: [
    PERMISSIONS.VIEW_ASSIGNED_PROJECTS,
    PERMISSIONS.EDIT_ARTIFACTS,
    PERMISSIONS.SUBMIT_WORK
  ]
};

const AuthContext = createContext();

// Backend URL configuration (preserved from original)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // In production, use same domain
  : 'http://localhost:8000'; // In development, point to Flask backend

export function AuthProvider({ children }) {
  // Original state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Enhanced LSS state
  const [lssUsers, setLssUsers] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [permissions, setPermissions] = useState([]);

  // Check if user is authenticated on app load (preserved from original)
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Load LSS users and set role when user changes
  useEffect(() => {
    if (user) {
      loadLSSUsers();
      setUserLSSRole();
    } else {
      setCurrentUserRole(null);
      setPermissions([]);
    }
  }, [user]);

  // Update permissions when role changes
  useEffect(() => {
    if (currentUserRole) {
      const rolePermissions = ROLE_PERMISSIONS[currentUserRole] || [];
      setPermissions(rolePermissions);
      console.log('Role changed to:', currentUserRole, 'Permissions:', rolePermissions);
    }
  }, [currentUserRole]);

  // Original auth functions (preserved exactly)
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lss_user_roles'); // Clear LSS roles on logout
    setUser(null);
    // Clear LSS data on logout
    setCurrentUserRole(null);
    setPermissions([]);
  };

  const signup = async (email, password, name) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  // New LSS functions
  const loadLSSUsers = () => {
    try {
      const savedUsers = localStorage.getItem('lss_users');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      setLssUsers(users);
    } catch (error) {
      console.error('Failed to load LSS users:', error);
    }
  };

  const setUserLSSRole = () => {
    if (!user) return;
    
    // Check if user has LSS role stored
    const lssUserData = localStorage.getItem('lss_user_roles');
    if (lssUserData) {
      try {
        const roles = JSON.parse(lssUserData);
        const userRole = roles[user.id] || roles[user.email];
        if (userRole && Object.values(USER_ROLES).includes(userRole)) {
          console.log('Loading saved role:', userRole, 'for user:', user.id || user.email);
          setCurrentUserRole(userRole);
          return;
        }
      } catch (error) {
        console.error('Failed to parse LSS roles:', error);
      }
    }
    
    // Default role assignment logic
    console.log('Setting default role for user:', user.email);
    if (user.email && user.email.toLowerCase().includes('admin')) {
      setCurrentUserRole(USER_ROLES.ADMIN);
    } else {
      // For now, make all users Project Leads so you can test functionality
      setCurrentUserRole(USER_ROLES.PROJECT_LEAD);
    }
  };

  const setUserRole = (userId, role) => {
    try {
      console.log('Setting role:', role, 'for user:', userId);
      
      // Validate role
      if (!Object.values(USER_ROLES).includes(role)) {
        console.error('Invalid role:', role);
        return false;
      }
      
      // Save role to localStorage
      const lssUserData = localStorage.getItem('lss_user_roles');
      const roles = lssUserData ? JSON.parse(lssUserData) : {};
      
      // Use both user ID and email as keys for flexibility
      roles[userId] = role;
      if (user && user.email) {
        roles[user.email] = role;
      }
      
      localStorage.setItem('lss_user_roles', JSON.stringify(roles));
      console.log('Saved roles to localStorage:', roles);
      
      // If updating current user's role
      if (userId === user?.id || userId === user?.email) {
        console.log('Updating current user role to:', role);
        setCurrentUserRole(role);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to set user role:', error);
      return false;
    }
  };

  // Permission checking functions
  const hasPermission = (permission) => {
    const hasIt = permissions.includes(permission);
    console.log('Checking permission:', permission, 'Result:', hasIt, 'Current permissions:', permissions);
    return hasIt;
  };

  const hasRole = (role) => {
    const hasIt = currentUserRole === role;
    console.log('Checking role:', role, 'Current role:', currentUserRole, 'Result:', hasIt);
    return hasIt;
  };

  const isAdmin = () => {
    return hasRole(USER_ROLES.ADMIN);
  };

  const isProjectLead = () => {
    return hasRole(USER_ROLES.PROJECT_LEAD);
  };

  const isTeamMember = () => {
    return hasRole(USER_ROLES.TEAM_MEMBER);
  };

  // Project access checking
  const canAccessProject = (project) => {
    if (isAdmin()) return true;
    if (isProjectLead() && project.leadId === user?.id) return true;
    if (project.teamMembers && project.teamMembers.includes(user?.id)) return true;
    return false;
  };

  const canEditProject = (project) => {
    if (isAdmin()) return true;
    if (isProjectLead() && project.leadId === user?.id) return true;
    return false;
  };

  const canAccessKanban = (project) => {
    // Only project leads can access Kanban (and only for their own projects)
    return isProjectLead() && project && project.leadId === user?.id;
  };

  // For backward compatibility, also provide canAccessKanban without project parameter
  const canAccessKanbanGeneral = () => {
    return isProjectLead();
  };

  const value = {
    // Original functionality (preserved exactly)
    user,
    loading,
    login,
    logout,
    signup,
    setUser,
    checkAuthStatus,
    
    // Enhanced LSS functionality
    lssUsers,
    currentUserRole,
    permissions,
    setUserRole,
    
    // Permission checking
    hasPermission,
    hasRole,
    isAdmin,
    isProjectLead,
    isTeamMember,
    
    // Project access
    canAccessProject,
    canEditProject,
    canAccessKanban,
    canAccessKanbanGeneral,
    
    // Constants
    USER_ROLES,
    PERMISSIONS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Preserve original useAuth hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

