import React, { useState } from "react";
import Modal from "./Modal";
import styles from "../../style/PasswordChangeModal.module.scss";
import { useModalContext } from '../../contexts/ModalContext';

const PasswordChangeModal: React.FC = () => {
  const { isPasswordModalOpen, closePasswordModal } = useModalContext();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // 기본적인 유효성 검사
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    
    // API 호출 (여기서는 성공했다고 가정)
    setSuccess(true);
    
    // 성공 후 3초 뒤에 모달 닫기
    setTimeout(() => {
      closePasswordModal();
      // 모달이 닫힌 후에 상태 초기화
      setTimeout(() => {
        setSuccess(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
      }, 300);
    }, 3000);
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
    closePasswordModal();
  };

  return (
    <Modal isOpen={isPasswordModalOpen} onClose={handleCancel}>
      <div className={styles.passwordChangeModal}>
        <h2>비밀번호 변경</h2>
        
        {success ? (
          <div className={styles.successMessage}>
            비밀번호가 성공적으로 변경되었습니다. 잠시 후 창이 닫힙니다.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label>현재 비밀번호</label>
              <input
                type="password"
                className={styles.inputField}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호 입력"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>새 비밀번호</label>
              <input
                type="password"
                className={styles.inputField}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호 입력 (8자 이상)"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>새 비밀번호 확인</label>
              <input
                type="password"
                className={styles.inputField}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호 재입력"
                required
              />
            </div>

            <div className={styles.buttonGroup}>
              <button 
                type="button" 
                className={styles.cancelBtn}
                onClick={handleCancel}
              >
                취소
              </button>
              <button 
                type="submit" 
                className={styles.submitBtn}
              >
                변경하기
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;