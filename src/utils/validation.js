export const VALIDATION_RULES = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    minLength: 8,
    maxLength: 50
  },
  title: {
    minLength: 3,
    maxLength: 100
  },
  location: {
    minLength: 3,
    maxLength: 100
  },
  description: {
    minLength: 10,
    maxLength: 1000
  },
  review: {
    minLength: 10,
    maxLength: 300
  }
};

export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return 'Username is required';
  }
  
  const trimmed = username.trim();
  
  if (trimmed.length < VALIDATION_RULES.username.minLength) {
    return `Username must be at least ${VALIDATION_RULES.username.minLength} characters long`;
  }
  
  if (trimmed.length > VALIDATION_RULES.username.maxLength) {
    return `Username must be no more than ${VALIDATION_RULES.username.maxLength} characters long`;
  }
  
  if (!VALIDATION_RULES.username.pattern.test(trimmed)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  
  return null;
};

export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  
  const trimmed = email.trim();
  
  if (!VALIDATION_RULES.email.pattern.test(trimmed)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return 'Password is required';
  }
  
  if (password.length < VALIDATION_RULES.password.minLength) {
    return `Password must be at least ${VALIDATION_RULES.password.minLength} characters long`;
  }
  
  if (password.length > VALIDATION_RULES.password.maxLength) {
    return `Password must be no more than ${VALIDATION_RULES.password.maxLength} characters long`;
  }
  
  return null;
};

export const validateTitle = (title) => {
  if (!title || title.trim() === '') {
    return 'Title is required';
  }
  
  const trimmed = title.trim();
  
  if (trimmed.length < VALIDATION_RULES.title.minLength) {
    return `Title must be at least ${VALIDATION_RULES.title.minLength} characters long`;
  }
  
  if (trimmed.length > VALIDATION_RULES.title.maxLength) {
    return `Title must be no more than ${VALIDATION_RULES.title.maxLength} characters long`;
  }
  
  return null;
};

export const validateLocation = (location) => {
  if (!location || location.trim() === '') {
    return 'Location is required';
  }
  
  const trimmed = location.trim();
  
  if (trimmed.length < VALIDATION_RULES.location.minLength) {
    return `Location must be at least ${VALIDATION_RULES.location.minLength} characters long`;
  }
  
  if (trimmed.length > VALIDATION_RULES.location.maxLength) {
    return `Location must be no more than ${VALIDATION_RULES.location.maxLength} characters long`;
  }
  
  return null;
};

export const validateDescription = (description) => {
  if (!description || description.trim() === '') {
    return 'Description is required';
  }
  
  const trimmed = description.trim();
  
  if (trimmed.length < VALIDATION_RULES.description.minLength) {
    return `Description must be at least ${VALIDATION_RULES.description.minLength} characters long`;
  }
  
  if (trimmed.length > VALIDATION_RULES.description.maxLength) {
    return `Description must be no more than ${VALIDATION_RULES.description.maxLength} characters long`;
  }
  
  return null;
};

export const validateImage = (file) => {
  if (!file) {
    return null; 
  }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; 
  
  if (!allowedTypes.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, GIF, or WebP)';
  }
  
  if (file.size > maxSize) {
    return 'Image file size must be less than 5MB';
  }
  
  return null;
};

export const validateReview = (review) => {
  if (!review || review.trim() === '') {
    return 'Review comment is required';
  }
  
  const trimmed = review.trim();
  
  if (trimmed.length < VALIDATION_RULES.review.minLength) {
    return `Review must be at least ${VALIDATION_RULES.review.minLength} character long`;
  }
  
  if (trimmed.length > VALIDATION_RULES.review.maxLength) {
    return `Review must be no more than ${VALIDATION_RULES.review.maxLength} characters long`;
  }
  
  return null;
};

export const validateRating = (rating) => {
  if (!rating || rating < 0 || rating > 5) {
    return 'Please select a rating between 0 and 5';
  }
  
  return null;
};

export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  const usernameError = validateUsername(formData.username);
  if (usernameError) errors.username = usernameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!formData.username || formData.username.trim() === '') {
    errors.username = 'Username is required';
  }
  
  if (!formData.password || formData.password.trim() === '') {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateDestinationForm = (formData) => {
  const errors = {};
  
  const titleError = validateTitle(formData.title);
  if (titleError) errors.title = titleError;
  
  const locationError = validateLocation(formData.location);
  if (locationError) errors.location = locationError;
  
  const descriptionError = validateDescription(formData.description);
  if (descriptionError) errors.description = descriptionError;
  
  const imageError = validateImage(formData.image);
  if (imageError) errors.image = imageError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateUserForm = (formData) => {
  const errors = {};
  
  const usernameError = validateUsername(formData.username);
  if (usernameError) errors.username = usernameError;
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  if (formData.password && formData.password.trim() !== '') {
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateReviewForm = (formData) => {
  const errors = {};
  
  const ratingError = validateRating(formData.rating);
  if (ratingError) errors.rating = ratingError;
  
  const reviewError = validateReview(formData.body);
  if (reviewError) errors.body = reviewError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 