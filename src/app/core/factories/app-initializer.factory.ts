import { AccessibilityService } from '../services/accessibility.service';
import { LanguageService } from '../services/language.service';

export function initializeApplicationFactory(
  languageService: LanguageService,
  accessibilityService: AccessibilityService
): () => Promise<void> {
  return async () => {
    await Promise.all([
      languageService.initialize(),
      accessibilityService.initialize()
    ]);
  };
}
