import React, { useState } from "react";
import Modal from "./Modal";
import styles from "../../style/DeleteAccountModal.module.scss";
import { deleteAccount } from "../../api/userApi";
import { useUserStore } from "../../store/UsersStore";
import { useNavigate } from "react-router-dom";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ErrorResponse {
  response?: {
    status?: number;
    data?: {
      password?: string;
      message?: string;
      [key: string]: unknown;
    };
  };
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const { clearUser } = useUserStore();
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    if (confirmText !== "회원탈퇴") {
      setError("'회원탈퇴'를 정확히 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await deleteAccount({ password });
      
      if (response.status === 200) {
        alert("회원 탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.");
        clearUser();
        onClose();
        navigate("/");
      }
    } catch (error) {
      const err = error as ErrorResponse;
      
      if (err.response?.status === 400) {
        if (err.response?.data?.password) {
          setError(`비밀번호 오류: ${err.response.data.password}`);
        } else {
          setError("비밀번호가 일치하지 않습니다.");
        }
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("회원 탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword("");
    setConfirmText("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <div className={styles.deleteAccountModal}>
        <h2 className={styles.modalHeader}>회원 탈퇴</h2>
        <div className={styles.modalContent}>
          <p className={styles.warningText}>
            회원 탈퇴 시 모든 정보가 삭제되며, 이 작업은 되돌릴 수 없습니다.
            정말로 탈퇴하시겠습니까?
          </p>

          <div className={styles.formGroup}>
            <label>비밀번호</label>
            <input
              type="password"
              className={styles.inputField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="현재 비밀번호를 입력하세요"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label>확인을 위해 '회원탈퇴'를 입력하세요</label>
            <input
              type="text"
              className={styles.inputField}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="회원탈퇴"
              disabled={loading}
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

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
              type="button"
              className={styles.deleteBtn}
              onClick={handleConfirm}
              disabled={loading || confirmText !== "회원탈퇴" || !password}
            >
              {loading ? "처리 중..." : "탈퇴하기"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;