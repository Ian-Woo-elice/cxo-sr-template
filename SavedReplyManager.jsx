import React, { useState } from 'react';

// Main component for managing Saved Replies
function SavedReplyManager() {
  // Initial categories with subcategories
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: '엘리스LXP',
      subcategories: [
        { id: 1, name: '로그인' },
        { id: 2, name: '결제' },
        { id: 3, name: '수업' },
      ],
    },
    {
      id: 2,
      name: '엘리스클라우드',
      subcategories: [
        { id: 4, name: '오류' },
        { id: 5, name: '영업' },
      ],
    },
  ]);

  // Selected category and subcategory
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    categories[0].subcategories[0]
  );

  // Template data list
  const [templates, setTemplates] = useState([
    {
      id: 1,
      categoryId: 1,
      subcategoryId: 1,
      issue: '로그인 오류',
      actionItem: '비밀번호 초기화 안내',
      savedReply: '비밀번호 초기화 링크를 보내드립니다.',
      note: '고객 요청',
    },
  ]);

  // Local state for new category/subcategory names
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  // Local state for new template inputs
  const [formData, setFormData] = useState({
    issue: '',
    actionItem: '',
    savedReply: '',
    note: '',
  });

  // Utility to copy text and alert success
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('클립보드에 복사되었습니다.');
    });
  };

  // Add new category
  const addCategory = () => {
    if (!newCategoryName) return;
    const nextId = Math.max(...categories.map((c) => c.id)) + 1;
    const updated = [
      ...categories,
      { id: nextId, name: newCategoryName, subcategories: [] },
    ];
    setCategories(updated);
    setNewCategoryName('');
  };

  // Edit category name
  const editCategory = (catId) => {
    const name = prompt('새 카테고리명을 입력하세요');
    if (!name) return;
    const updated = categories.map((c) =>
      c.id === catId ? { ...c, name } : c
    );
    setCategories(updated);
  };

  // Delete category
  const deleteCategory = (catId) => {
    const updated = categories.filter((c) => c.id !== catId);
    setCategories(updated);
    if (selectedCategory && selectedCategory.id === catId) {
      setSelectedCategory(updated[0] || null);
      setSelectedSubcategory(updated[0]?.subcategories[0] || null);
    }
  };

  // Add subcategory
  const addSubcategory = () => {
    if (!newSubcategoryName || !selectedCategory) return;
    const nextId = Math.max(
      0,
      ...categories.flatMap((c) => c.subcategories.map((s) => s.id))
    ) + 1;
    const updated = categories.map((c) =>
      c.id === selectedCategory.id
        ? {
            ...c,
            subcategories: [
              ...c.subcategories,
              { id: nextId, name: newSubcategoryName },
            ],
          }
        : c
    );
    setCategories(updated);
    setNewSubcategoryName('');
  };

  // Edit subcategory
  const editSubcategory = (subId) => {
    const name = prompt('새 하위 카테고리명을 입력하세요');
    if (!name) return;
    const updated = categories.map((c) =>
      c.id === selectedCategory.id
        ? {
            ...c,
            subcategories: c.subcategories.map((s) =>
              s.id === subId ? { ...s, name } : s
            ),
          }
        : c
    );
    setCategories(updated);
  };

  // Delete subcategory
  const deleteSubcategory = (subId) => {
    const updated = categories.map((c) =>
      c.id === selectedCategory.id
        ? {
            ...c,
            subcategories: c.subcategories.filter((s) => s.id !== subId),
          }
        : c
    );
    setCategories(updated);
    if (selectedSubcategory && selectedSubcategory.id === subId) {
      const currentCat = updated.find((c) => c.id === selectedCategory.id);
      setSelectedSubcategory(currentCat?.subcategories[0] || null);
    }
  };

  // Add new template
  const addTemplate = () => {
    if (!selectedCategory || !selectedSubcategory) return;
    const nextId = templates.length ? Math.max(...templates.map((t) => t.id)) + 1 : 1;
    const newTemplate = {
      id: nextId,
      categoryId: selectedCategory.id,
      subcategoryId: selectedSubcategory.id,
      issue: formData.issue,
      actionItem: formData.actionItem,
      savedReply: formData.savedReply,
      note: formData.note,
    };
    setTemplates([...templates, newTemplate]);
    setFormData({ issue: '', actionItem: '', savedReply: '', note: '' });
  };

  // Delete template
  const deleteTemplate = (id) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Filter templates based on selected category/subcategory
  const visibleTemplates = templates.filter(
    (t) =>
      t.categoryId === selectedCategory?.id &&
      t.subcategoryId === selectedSubcategory?.id
  );

  return (
    <div style={styles.container}>
      <h2>Saved Reply 관리</h2>
      <div>
        현재 선택: {selectedCategory?.name} / {selectedSubcategory?.name}
      </div>

      {/* Category List */}
      <div style={styles.categoryList}>
        <input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="새 카테고리"
        />
        <button style={styles.button} onClick={addCategory}>
          추가
        </button>
        {categories.map((cat) => (
          <div key={cat.id} style={styles.listItem}>
            <button
              style={styles.categoryButton}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubcategory(cat.subcategories[0] || null);
              }}
            >
              {cat.name}
            </button>
            <button style={styles.smallButton} onClick={() => editCategory(cat.id)}>
              수정
            </button>
            <button style={styles.smallButton} onClick={() => deleteCategory(cat.id)}>
              삭제
            </button>
          </div>
        ))}
      </div>

      {/* Subcategory List */}
      {selectedCategory && (
        <div style={styles.subcategoryList}>
          <input
            value={newSubcategoryName}
            onChange={(e) => setNewSubcategoryName(e.target.value)}
            placeholder="새 하위 카테고리"
          />
          <button style={styles.button} onClick={addSubcategory}>
            추가
          </button>
          {selectedCategory.subcategories.map((sub) => (
            <div key={sub.id} style={styles.listItem}>
              <button
                style={styles.categoryButton}
                onClick={() => setSelectedSubcategory(sub)}
              >
                {sub.name}
              </button>
              <button
                style={styles.smallButton}
                onClick={() => editSubcategory(sub.id)}
              >
                수정
              </button>
              <button
                style={styles.smallButton}
                onClick={() => deleteSubcategory(sub.id)}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Template Table */}
      <table style={styles.table}>
        <thead style={styles.tableHeader}>
          <tr>
            <th>Issue</th>
            <th>Action Item</th>
            <th>Saved Reply</th>
            <th>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visibleTemplates.map((t) => (
            <tr key={t.id} style={styles.tableRow}>
              <td>{t.issue}</td>
              <td>{t.actionItem}</td>
              <td>
                <button
                  style={styles.copyButton}
                  onClick={() => copyToClipboard(t.savedReply)}
                >
                  {t.savedReply}
                </button>
              </td>
              <td>{t.note}</td>
              <td>
                <button style={styles.smallButton} onClick={() => deleteTemplate(t.id)}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Template Form */}
      <div style={styles.formContainer}>
        <input
          name="issue"
          value={formData.issue}
          onChange={handleInputChange}
          placeholder="Issue"
        />
        <input
          name="actionItem"
          value={formData.actionItem}
          onChange={handleInputChange}
          placeholder="Action Item"
        />
        <input
          name="savedReply"
          value={formData.savedReply}
          onChange={handleInputChange}
          placeholder="Saved Reply"
        />
        <input
          name="note"
          value={formData.note}
          onChange={handleInputChange}
          placeholder="Note"
        />
        <button style={styles.button} onClick={addTemplate}>
          템플릿 추가
        </button>
      </div>
    </div>
  );
}

// Basic inline styles
const styles = {
  container: {
    fontFamily: 'sans-serif',
    padding: '1rem',
  },
  button: {
    background: 'linear-gradient(90deg, #8e2de2, #4a00e0)',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    margin: '0.25rem',
    cursor: 'pointer',
  },
  smallButton: {
    background: '#8e2de2',
    color: '#fff',
    border: 'none',
    padding: '0.25rem 0.5rem',
    marginLeft: '0.25rem',
    cursor: 'pointer',
  },
  categoryButton: {
    background: '#f0f0f0',
    border: '1px solid #ccc',
    padding: '0.5rem',
    cursor: 'pointer',
  },
  categoryList: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '1rem',
    alignItems: 'center',
  },
  subcategoryList: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '1rem',
    alignItems: 'center',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '0.5rem',
    marginTop: '0.5rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  tableHeader: {
    background: '#e0f7ff',
  },
  tableRow: {
    borderBottom: '1px solid #ccc',
  },
  copyButton: {
    background: 'none',
    border: 'none',
    color: '#4a00e0',
    cursor: 'pointer',
  },
  formContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '1rem',
    gap: '0.5rem',
  },
};

export default SavedReplyManager;

