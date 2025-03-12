// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Loading Animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader-wrapper');
    loader.style.opacity = '0';
    setTimeout(() => {
        loader.style.display = 'none';
    }, 500);
});

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const moonIcon = darkModeToggle.querySelector('i');

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
    document.documentElement.setAttribute('data-theme', 'dark');
    moonIcon.classList.replace('fa-moon', 'fa-sun');
}

darkModeToggle.addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('darkMode', null);
        moonIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('darkMode', 'enabled');
        moonIcon.classList.replace('fa-moon', 'fa-sun');
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
})();

// Contact Form Validation and Submission
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');

const showError = (input, message) => {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    errorMessage.textContent = message;
    formGroup.classList.add('error');
};

const clearError = (input) => {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    errorMessage.textContent = '';
    formGroup.classList.remove('error');
};

const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    // Clear previous errors
    clearError(nameInput);
    clearError(emailInput);
    clearError(subjectInput);
    clearError(messageInput);

    // Validate Name
    if (nameInput.value.trim() === '') {
        showError(nameInput, 'Name is required');
        isValid = false;
    }

    // Validate Email
    if (emailInput.value.trim() === '') {
        showError(emailInput, 'Email is required');
        isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email');
        isValid = false;
    }

    // Validate Subject
    if (subjectInput.value.trim() === '') {
        showError(subjectInput, 'Subject is required');
        isValid = false;
    }

    // Validate Message
    if (messageInput.value.trim() === '') {
        showError(messageInput, 'Message is required');
        isValid = false;
    }

    if (isValid) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.classList.add('loading');

        try {
            // Send email using EmailJS
            const templateParams = {
                from_name: nameInput.value.trim(),
                from_email: emailInput.value.trim(),
                subject: subjectInput.value.trim(),
                message: messageInput.value.trim(),
                to_email: 'wovensackhub@gmail.com'
            };

            await emailjs.send(
                'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                templateParams
            );

            // Show success message
            Swal.fire({
                title: 'Message Sent!',
                text: 'Thank you for contacting us. We will get back to you soon.',
                icon: 'success',
                confirmButtonColor: '#4CAF50'
            });

            // Reset form
            contactForm.reset();
        } catch (error) {
            console.error('Error sending email:', error);
            Swal.fire({
                title: 'Error!',
                text: 'There was an error sending your message. Please try again later.',
                icon: 'error',
                confirmButtonColor: '#4CAF50'
            });
        } finally {
            submitButton.classList.remove('loading');
        }
    }
});

// Buy Button and Razorpay Integration
function buyProduct(product) {
    const prices = {
        'Loom Formula': 99900,
        'Tape Plant Formula': 149900,
        'Quality Inspection': 199900,
        'Advanced Formula': 249900
    };

    Swal.fire({
        title: 'Proceeding to Payment',
        text: `You are buying ${product}. Click proceed to continue with the payment.`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Proceed to Payment'
    }).then((result) => {
        if (result.isConfirmed) {
            const options = {
                key: "your_razorpay_key", // Replace with your Razorpay Key
                amount: prices[product],
                currency: "INR",
                name: "WovenSackEDU",
                description: `${product} Purchase`,
                image: "your_logo_url",
                handler: function (response) {
                    Swal.fire({
                        title: 'Payment Successful!',
                        text: 'Thank you for your purchase. You will receive access to the course materials shortly.',
                        icon: 'success',
                        confirmButtonColor: '#4CAF50'
                    }).then(() => {
                        // Handle post-payment actions (e.g., redirect to course page)
                        // window.location.href = '/course-access';
                    });
                },
                prefill: {
                    name: "",
                    email: "",
                    contact: ""
                },
                theme: {
                    color: "#4CAF50"
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();
        }
    });
}

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .testimonial, .stat-item').forEach(element => {
    observer.observe(element);
});

// Firebase Configuration
const firebaseConfig = {
    // Replace with your Firebase config
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Modal Handling
const loginModal = document.getElementById('loginModal');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const loginLink = document.getElementById('login-link');
const closeBtns = document.querySelectorAll('.close');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const passwordToggles = document.querySelectorAll('.password-toggle');
const forgotPasswordLink = document.querySelector('.forgot-password');

// Show login modal
loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// Close modals
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        forgotPasswordModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (e.target === forgotPasswordModal) {
        forgotPasswordModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Toggle between login and register forms
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetForm = tab.getAttribute('data-tab');
        
        // Update tabs
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update forms
        authForms.forEach(form => {
            form.classList.remove('active');
            if (form.id === `${targetForm}Form`) {
                form.classList.add('active');
            }
        });
    });
});

// Toggle password visibility
passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const input = toggle.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            toggle.classList.replace('fa-eye-slash', 'fa-eye');
        } else {
            input.type = 'password';
            toggle.classList.replace('fa-eye', 'fa-eye-slash');
        }
    });
});

// Show forgot password modal
forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    forgotPasswordModal.style.display = 'block';
});

// Login Form Handling
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    
    submitBtn.classList.add('loading');
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        Swal.fire({
            title: 'Success!',
            text: 'You have been successfully logged in.',
            icon: 'success',
            confirmButtonColor: '#4CAF50'
        }).then(() => {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            loginForm.reset();
            updateUIForLoggedInUser();
        });
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: getAuthErrorMessage(error.code),
            icon: 'error',
            confirmButtonColor: '#4CAF50'
        });
    } finally {
        submitBtn.classList.remove('loading');
    }
});

// Register Form Handling
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = registerForm.querySelector('button[type="submit"]');

    if (password !== confirmPassword) {
        Swal.fire({
            title: 'Error!',
            text: 'Passwords do not match!',
            icon: 'error',
            confirmButtonColor: '#4CAF50'
        });
        return;
    }

    submitBtn.classList.add('loading');

    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        await result.user.updateProfile({
            displayName: name
        });
        
        Swal.fire({
            title: 'Success!',
            text: 'Your account has been created successfully.',
            icon: 'success',
            confirmButtonColor: '#4CAF50'
        }).then(() => {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            registerForm.reset();
            updateUIForLoggedInUser();
        });
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: getAuthErrorMessage(error.code),
            icon: 'error',
            confirmButtonColor: '#4CAF50'
        });
    } finally {
        submitBtn.classList.remove('loading');
    }
});

// Forgot Password Form Handling
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');

    submitBtn.classList.add('loading');

    try {
        await auth.sendPasswordResetEmail(email);
        Swal.fire({
            title: 'Success!',
            text: 'Password reset link has been sent to your email.',
            icon: 'success',
            confirmButtonColor: '#4CAF50'
        }).then(() => {
            forgotPasswordModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            forgotPasswordForm.reset();
        });
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: getAuthErrorMessage(error.code),
            icon: 'error',
            confirmButtonColor: '#4CAF50'
        });
    } finally {
        submitBtn.classList.remove('loading');
    }
});

// Social Login Handling
const googleBtn = document.querySelector('.social-btn.google');
const facebookBtn = document.querySelector('.social-btn.facebook');

googleBtn.addEventListener('click', async () => {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        updateUIForLoggedInUser();
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: getAuthErrorMessage(error.code),
            icon: 'error',
            confirmButtonColor: '#4CAF50'
        });
    }
});

facebookBtn.addEventListener('click', async () => {
    try {
        const provider = new firebase.auth.FacebookAuthProvider();
        await auth.signInWithPopup(provider);
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        updateUIForLoggedInUser();
    } catch (error) {
        Swal.fire({
            title: 'Error!',
            text: getAuthErrorMessage(error.code),
            icon: 'error',
            confirmButtonColor: '#4CAF50'
        });
    }
});

// Auth State Change Handler
auth.onAuthStateChanged(user => {
    if (user) {
        updateUIForLoggedInUser();
    } else {
        updateUIForLoggedOutUser();
    }
});

// Helper Functions
function updateUIForLoggedInUser() {
    const user = auth.currentUser;
    loginLink.textContent = user.displayName || 'Profile';
    loginLink.href = '#profile';
}

function updateUIForLoggedOutUser() {
    loginLink.textContent = 'Login';
    loginLink.href = '#login';
}

function getAuthErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/wrong-password':
            return 'Invalid password. Please try again.';
        case 'auth/user-not-found':
            return 'No user found with this email address.';
        case 'auth/email-already-in-use':
            return 'This email address is already registered.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters long.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        default:
            return 'An error occurred. Please try again.';
    }
}
