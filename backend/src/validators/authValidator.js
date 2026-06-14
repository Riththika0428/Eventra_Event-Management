export const validateRegister = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 2)
    errors.push('Name must be at least 2 characters.');

  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email))
    errors.push('Please provide a valid email.');

  if (!data.password || data.password.length < 6)
    errors.push('Password must be at least 6 characters.');

  if (data.role && !['attendee', 'organizer'].includes(data.role))
    errors.push('Role must be attendee or organizer.');

  return errors;
};

export const validateLogin = (data) => {
  const errors = [];

  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email))
    errors.push('Please provide a valid email.');

  if (!data.password)
    errors.push('Password is required.');

  return errors;
};