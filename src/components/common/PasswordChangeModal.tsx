import React, { useState } from "react";
import Modal from "./Modal";
import styles from "../../style/PasswordChangeModal.module.scss";
import { useModalContext } from "../../contexts/ModalContext";
import { changePassword } from "../../api/userApi";

const PasswordChangeModal: React.FC = () => {
  const { isPasswordModalOpen, closePasswordModal } = useModalContext();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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

    setLoading(true);
    try {
      const response = await changePassword({
        current_password: currentPassword,
        new_password: newPassword
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          closePasswordModal();
          setTimeout(() => {
            setSuccess(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setError("");
          }, 300);
        }, 3000);
      }
    } catch (error) {
      const err = error as { response?: { status?: number, data?: any } };
      
      if (err.response?.status === 401) {
        setError("현재 비밀번호가 일치하지 않습니다.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.current_password) {
        setError(`현재 비밀번호 오류: ${err.response.data.current_password}`);
      } else if (err.response?.data?.new_password) {
        setError(`새 비밀번호 오류: ${err.response.data.new_password}`);
      } else {
        setError("비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
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
        <h2 className={styles.modalHeader}>비밀번호 변경</h2>

        {success ? (
          <div className={styles.successMessage}>
            비밀번호가 성공적으로 변경되었습니다. 잠시 후 창이 닫힙니다.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.inputGroup}>
              <label>현재 비밀번호</label>
              <input
                type="password"
                className={styles.inputField}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호 입력"
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
                required
              />
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={handleCancel}
                disabled={loading}
              >
                취소
              </button>
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "처리 중..." : "변경하기"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;