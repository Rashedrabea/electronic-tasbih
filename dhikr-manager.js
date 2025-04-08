document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // تبديل التبويبات
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(`${tabName}-content`).classList.add('active');
        });
    });

    // تحميل البيانات المحفوظة
    loadSavedItems();

    // معالجة النماذج
    document.querySelectorAll('.add-form').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    function handleFormSubmit(e) {
        e.preventDefault();
        const formType = e.target.closest('.tab-content').id.split('-')[0];
        const formData = new FormData(e.target);
        
        saveNewItem(formType, Object.fromEntries(formData));
        e.target.reset();
        loadSavedItems();
    }

    function saveNewItem(type, data) {
        const items = JSON.parse(localStorage.getItem(`${type}Items`) || '[]');
        items.push({ ...data, id: Date.now() });
        localStorage.setItem(`${type}Items`, JSON.stringify(items));
    }

    function loadSavedItems() {
        ['morning', 'evening', 'hadith'].forEach(type => {
            const items = JSON.parse(localStorage.getItem(`${type}Items`) || '[]');
            const listElement = document.getElementById(`${type}-list`);
            
            listElement.innerHTML = items.map(item => 
                createItemCard(type, item)
            ).join('');
        });
    }

    function createItemCard(type, item) {
        if (type === 'hadith') {
            return `
                <div class="hadith-card" data-id="${item.id}">
                    <div class="text">${item.text}</div>
                    <div class="narrator">${item.narrator}</div>
                    <div class="actions">
                        <button class="edit-btn" onclick="editItem('${type}', ${item.id})">تعديل</button>
                        <button class="delete-btn" onclick="deleteItem('${type}', ${item.id})">حذف</button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="item-card" data-id="${item.id}">
                <div class="text">${item.text} (${item.count} مرة)</div>
                <div class="actions">
                    <button class="edit-btn" onclick="editItem('${type}', ${item.id})">تعديل</button>
                    <button class="delete-btn" onclick="deleteItem('${type}', ${item.id})">حذف</button>
                </div>
            </div>
        `;
    }

    // وظائف التعديل والحذف
    window.editItem = function(type, id) {
        // تنفيذ التعديل
    }

    window.deleteItem = function(type, id) {
        if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
            const items = JSON.parse(localStorage.getItem(`${type}Items`) || '[]');
            const newItems = items.filter(item => item.id !== id);
            localStorage.setItem(`${type}Items`, JSON.stringify(newItems));
            loadSavedItems();
        }
    }
});
