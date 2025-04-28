document.addEventListener('DOMContentLoaded', function() {
    // Form validation and submission
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            if (contactForm.checkValidity()) {
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.querySelector('.submit-text').classList.add('d-none');
                submitBtn.querySelector('.spinner-border').classList.remove('d-none');
                
                // Prepare form data
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    mobile: document.getElementById('mobile').value,
                    category: document.getElementById('category').value,
                    subject: document.getElementById('subject').value,
                    description: document.getElementById('description').value
                };
                
                // Here you would make the API call
                // This is a placeholder - replace with your actual API call
                simulateApiCall(formData)
                    .then(response => {
                        // Show success modal
                        successModal.show();
                        
                        // Reset form
                        contactForm.reset();
                        contactForm.classList.remove('was-validated');
                    })
                    .catch(error => {
                        console.error('Error submitting form:', error);
                        alert('There was an error submitting your form. Please try again.');
                    })
                    .finally(() => {
                        // Reset button state
                        submitBtn.disabled = false;
                        submitBtn.querySelector('.submit-text').classList.remove('d-none');
                        submitBtn.querySelector('.spinner-border').classList.add('d-none');
                    });
            } else {
                contactForm.classList.add('was-validated');
                
                // Add shake animation to invalid fields
                const invalidFields = contactForm.querySelectorAll(':invalid');
                invalidFields.forEach(field => {
                    field.classList.add('animate__animated', 'animate__shakeX');
                    field.addEventListener('animationend', () => {
                        field.classList.remove('animate__animated', 'animate__shakeX');
                    }, { once: true });
                });
            }
        }, false);
    }
    
    // Function to simulate API call (replace with actual fetch)
    function simulateApiCall(formData) {
        return new Promise((resolve) => {
            console.log('Form data to be submitted:', formData);
            
            // Simulate network delay
            setTimeout(() => {
                resolve({ status: 'success', message: 'Form submitted successfully' });
            }, 1500);
        });
    }
    
    // Add floating animation to contact info cards on hover
    const contactCards = document.querySelectorAll('.contact-info-card');
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});