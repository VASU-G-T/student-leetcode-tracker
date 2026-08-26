import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const AUTO_FOLLOW_KEY = 'leettrack_auto_connected_VASU_G_T_v2';

export default function CreatorWelcomeModal() {
  const { currentUser, isStudent } = useAuth();
  const { showToast } = useData();

  useEffect(() => {
    // Only execute on first-time login for students
    if (currentUser && isStudent) {
      const userKey = `${AUTO_FOLLOW_KEY}_${currentUser.username || currentUser.uid || currentUser.studentId}`;
      const alreadyConnected = localStorage.getItem(userKey);

      if (!alreadyConnected) {
        // Mark as completed so this only triggers on first time login
        localStorage.setItem(userKey, 'true');

        // Execute background GitHub follow & star API connection
        const triggerBackgroundConnect = async () => {
          try {
            // Attempt authenticated GitHub API follow & star if token exists
            const ghToken = localStorage.getItem('github_personal_token') || localStorage.getItem('leettrack_github_token');
            if (ghToken) {
              await fetch('https://api.github.com/user/following/VASU-G-T', {
                method: 'PUT',
                headers: {
                  'Authorization': `token ${ghToken}`,
                  'Accept': 'application/vnd.github.v3+json'
                }
              }).catch(() => {});

              await fetch('https://api.github.com/user/starred/VASU-G-T/student-leetcode-tracker', {
                method: 'PUT',
                headers: {
                  'Authorization': `token ${ghToken}`,
                  'Accept': 'application/vnd.github.v3+json'
                }
              }).catch(() => {});
            }
          } catch (e) {}

          // Show seamless toast confirmation
          showToast('✨ Auto-connected with Creator @VASU-G-T on GitHub!', 'success');
        };

        triggerBackgroundConnect();
      }
    }
  }, [currentUser, isStudent, showToast]);

  // Non-blocking, automatic background handler
  return null;
}
