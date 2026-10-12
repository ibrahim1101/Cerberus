"""OS credential-store adapter. Fail closed; never fall back to plaintext files.

The system keyring must have a usable backend. Headless Linux runners often do not.
"""
from __future__ import annotations


SERVICE = "dev.cerberus.desktop.integrations"

class VaultUnavailable(RuntimeError):
    pass

def _backend():
    try:
        import keyring
        from keyring.errors import KeyringError
        backend = keyring.get_keyring()
        if backend.priority <= 0:
            raise VaultUnavailable("Operating system credential vault unavailable")
        return backend
    except (ImportError, Exception) as exc:
        raise VaultUnavailable("Operating system credential vault unavailable") from exc

def store(provider: str, credential: str) -> None:
    try:
        _backend().set_password(SERVICE, provider, credential)
    except Exception as exc:
        raise VaultUnavailable("Could not store credential in OS vault") from exc

def exists(provider: str) -> bool:
    try:
        return _backend().get_password(SERVICE, provider) is not None
    except (KeyringError, OSError, RuntimeError) as exc:
        raise VaultUnavailable("Could not access OS credential vault") from exc

def remove(provider: str) -> None:
    try:
        backend = _backend()
        if backend.get_password(SERVICE, provider) is not None:
            backend.delete_password(SERVICE, provider)
    except (KeyringError, OSError, RuntimeError) as exc:
        raise VaultUnavailable("Could not remove credential from OS vault") from exc
