// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// 移动端菜单
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-blue-600 text-white';
    mobileMenuButton.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
    `;
    
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('nav .hidden');
    
    nav.appendChild(mobileMenuButton);
    
    mobileMenuButton.addEventListener('click', function() {
        navLinks.classList.toggle('mobile-menu');
        navLinks.classList.toggle('active');
        navLinks.classList.toggle('hidden');
        navLinks.classList.toggle('fixed');
        navLinks.classList.toggle('top-16');
        navLinks.classList.toggle('left-0');
        navLinks.classList.toggle('right-0');
        navLinks.classList.toggle('bg-white');
        navLinks.classList.toggle('p-4');
        navLinks.classList.toggle('shadow-lg');
    });
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 移动端菜单控制
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            mobileMenu.classList.toggle('hidden');
        });

        // 点击菜单项后自动关闭菜单
        const menuItems = mobileMenu.getElementsByTagName('a');
        for (let item of menuItems) {
            item.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        }

        // 点击页面其他区域关闭菜单
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}); 