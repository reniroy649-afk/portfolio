const projectsData = {
    'project-1': {
        title: 'Dragon Fly Cycle',
        category: 'Branding',
        year: '2024',
        image: 'image 2.png',
        description: 'An intricate study of motion and form, capturing the frame-by-frame animation of a dragon fly. This project highlights the fluid dynamics of flight through traditional animation principles applied to a digital medium.',
        sequence: [
            'image 1.png', 'image 2.png', 'image 3.png', 'image 1.png', 'image 2.png', 'image 3.png', 'image 1.png', 'image 2.png'
        ],
        visuals: [
            { title: 'Character Design', img: 'image 1.png' },
            { title: 'Environment Layout', img: 'image 3.png' }
        ]
    },
    'project-2': {
        title: '3D Mechanical Study',
        category: '3D Design',
        year: '2023',
        image: 'image 1.png',
        description: 'Detailed exploration of hard-surface modeling and mechanical articulation. Focus on realistic materials and functional design logic.',
        sequence: null,
        visuals: [
            { title: 'Exploded View', img: 'image 2.png' },
            { title: 'Texture Detail', img: 'image 3.png' }
        ]
    },
    'project-3': {
        title: 'Motion Branding',
        category: 'Motion',
        year: '2024',
        image: 'image 3.png',
        description: 'Dynamic visual identity for a creative agency, blending liquid motion with bold typography.',
        sequence: null,
        visuals: [
            { title: 'Typography Motion', img: 'image 1.png' },
            { title: 'Color Palette', img: 'image 2.png' }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('id');
    const projectContent = document.getElementById('project-content');

    if (projectId && projectsData[projectId]) {
        const project = projectsData[projectId];
        renderProject(project);
    } else {
        projectContent.innerHTML = `
            <div class="container section-padding text-center">
                <h2>Project Not Found</h2>
                <p>Sorry, the project you're looking for doesn't exist.</p>
                <a href="index.html" class="btn btn-primary">Back to Home</a>
            </div>
        `;
    }

    function renderProject(project) {
        projectContent.innerHTML = `
            <section class="graphic-hero">
                <div class="hero-content">
                    <h1>${project.category}</h1>
                    <p>${project.description}</p>
                </div>
            </section>

            <div class="projects-container">
                ${project.visuals.map(visual => `
                    <div class="project-item reveal">
                        <div class="project-visual">
                            <img src="${visual.img}" alt="${visual.title}">
                        </div>
                        <div class="project-details">
                            <h3>${visual.title}</h3>
                            <p>
                                Detailed breakdown of the creative process for ${visual.title}. 
                                Focusing on structure, clarity, and a visual identity that matches the project specifications.
                            </p>
                            <a class="btn-project" href="${visual.img}" target="_blank">View Project</a>
                        </div>
                    </div>
                `).join('')}

                ${project.sequence ? `
                    <div class="project-item reveal">
                        <div class="project-details">
                            <h3>Animation Sequence</h3>
                            <p>A breakdown of the frame-by-frame animation process and motion dynamics.</p>
                        </div>
                        <div class="project-visual gallery-scroll-container" style="background: var(--primary-dark); padding: 1rem;">
                            <div class="frame-sequence">
                                ${project.sequence.map(img => `
                                    <div class="frame-item">
                                        <img src="${img}" alt="Sequence Frame">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>

            <div class="next-steps-nav reveal">
                <a href="index.html#portfolio" class="back-btn">
                    <i class="ph ph-arrow-left"></i> Back to Portfolio
                </a>
            </div>
        `;

        // Initialize animations
        setTimeout(() => {
            const reveals = projectContent.querySelectorAll('.reveal');
            reveals.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('active');
                }, index * 150);
            });
        }, 300);
    }
});
