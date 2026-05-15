import { AccessibilityService } from '../services/accessibility.service';
import { LanguageService } from '../services/language.service';
import { AuthService } from '../../services/auth.service';

export function initializeApplicationFactory(
  languageService: LanguageService,
  accessibilityService: AccessibilityService,
  authService: AuthService
): () => Promise<void> {
  return async () => {
    await Promise.all([
      languageService.initialize(),
      accessibilityService.initialize(),
      authService.initialize()
    ]);
  };
}
