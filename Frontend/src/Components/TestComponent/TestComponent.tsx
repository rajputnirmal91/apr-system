import React, { useState, useEffect } from 'react';
import './TestComponent.scss';


export const TestComponent: React.FC<{ userId: string }> = ({ userId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});


  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = async () => {
    setLoading(true);
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();
    setUsers(data);
    setLoading(false);
  };


  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // This object is recreated on every render
    const userConfig = { id: user.id, name: user.name };
    processUser(userConfig);
  };


  const renderUserList = () => {
    return (
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.name}
          </li>
        ))}
      </ul>
    );
  };

  const renderUserBio = () => {
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: selectedUser?.bio || ''
        }}
      />
    );
  };


  const renderUserDetails = () => {
    return (
      <UserDetails
        user={selectedUser}
        onUpdate={handleUserUpdate}
        onDelete={handleUserDelete}
        onRefresh={fetchUsers}
        theme="light"
        isAdmin={true}
        canEdit={true}
        canDelete={true}
      />
    );
  };

  const handleUserUpdate = async (updatedUser) => {
    const response = await fetch(`/api/users/${updatedUser.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedUser)
    });
    const data = await response.json();
    setSelectedUser(data);
  };

  
  const getUserEmail = () => {
    return selectedUser.profile.contact.email;
  };

  
  return (
    <div className="test-component">
      <h1 style={{ color: '#FF5733', fontSize: '24px' }}>User Management</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {renderUserList()}
      {selectedUser && renderUserDetails()}
    </div>
  );
};


const UserDetails: React.FC<any> = (props) => {
  return (
    <div>
      <h2>{props.user?.name}</h2>
      <p>{props.user?.email}</p>
      <button onClick={props.onUpdate}>Update</button>
      <button onClick={props.onDelete}>Delete</button>
    </div>
  );
};

export default TestComponent;
