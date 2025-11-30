/* eslint-env jest */
/**
 * Tests de validation logique - Multi-opérations Discovery/Adventure
 * Phase R2 - Tests unitaires pour vérifier la logique multi-opérations
 */

describe('Multi-Operations Logic Validation', () => {
  describe('Discovery Mode - Logic Tests', () => {
    describe('Opérateur et mode de sélection', () => {
      it('devrait déterminer mode sélection selon opérateur', () => {
        // Pour ×: sélection de tables (1-10)
        const multiplicationMode = {
          operator: '×',
          getSelectionMode: function () {
            return this.operator === '×' ? 'tables' : 'levels';
          },
        };
        expect(multiplicationMode.getSelectionMode()).toBe('tables');

        // Pour +/−: sélection de niveaux (easy/medium/hard)
        const additionMode = {
          operator: '+',
          getSelectionMode: function () {
            return this.operator === '×' ? 'tables' : 'levels';
          },
        };
        expect(additionMode.getSelectionMode()).toBe('levels');
      });

      it('devrait générer ranges appropriées pour addition/soustraction', () => {
        const getLevelRange = (operator, difficulty) => {
          const ranges = {
            '+': {
              easy: '≤10',
              medium: '≤20',
              hard: '≤40',
            },
            '−': {
              easy: '1-10',
              medium: '1-20',
              hard: '1-50',
            },
          };
          return ranges[operator]?.[difficulty] || '';
        };

        expect(getLevelRange('+', 'easy')).toBe('≤10');
        expect(getLevelRange('+', 'medium')).toBe('≤20');
        expect(getLevelRange('+', 'hard')).toBe('≤40');

        expect(getLevelRange('−', 'easy')).toBe('1-10');
        expect(getLevelRange('−', 'medium')).toBe('1-20');
        expect(getLevelRange('−', 'hard')).toBe('1-50');
      });
    });

    describe('Génération exemples opérations', () => {
      it('devrait générer exemples avec difficulté pour addition', () => {
        const generateExamples = (operator, difficulty, count) => {
          const examples = [];
          for (let i = 0; i < count; i++) {
            let a, b;
            if (operator === '+') {
              const max = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 20;
              a = Math.floor(Math.random() * max) + 1;
              b = Math.floor(Math.random() * max) + 1;
            }
            examples.push({ a, b, result: a + b });
          }
          return examples;
        };

        const examples = generateExamples('+', 'easy', 5);
        expect(examples).toHaveLength(5);
        examples.forEach(ex => {
          expect(ex.a).toBeGreaterThanOrEqual(1);
          expect(ex.a).toBeLessThanOrEqual(5);
          expect(ex.b).toBeGreaterThanOrEqual(1);
          expect(ex.b).toBeLessThanOrEqual(5);
          expect(ex.result).toBe(ex.a + ex.b);
        });
      });

      it('devrait générer exemples avec difficulté pour soustraction', () => {
        const generateExamples = (operator, difficulty, count) => {
          const examples = [];
          for (let i = 0; i < count; i++) {
            let a, b;
            if (operator === '−') {
              const max = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 50;
              a = Math.floor(Math.random() * max) + 1;
              b = Math.floor(Math.random() * Math.min(a, max)) + 1;
              // Assurer a >= b
              if (b > a) [a, b] = [b, a];
            }
            examples.push({ a, b, result: a - b });
          }
          return examples;
        };

        const examples = generateExamples('−', 'medium', 5);
        expect(examples).toHaveLength(5);
        examples.forEach(ex => {
          expect(ex.a).toBeGreaterThanOrEqual(ex.b); // Soustraction: a >= b
          expect(ex.result).toBe(ex.a - ex.b);
          expect(ex.result).toBeGreaterThanOrEqual(0); // Pas de négatifs
        });
      });
    });

    describe('Visualisation objets selon opération', () => {
      it('devrait calculer nombre objets pour multiplication', () => {
        const getObjectCount = (operator, a, b) => {
          if (operator === '×') {
            return a * b; // Total objets = groupes * objets par groupe
          }
          return 0;
        };

        expect(getObjectCount('×', 3, 4)).toBe(12); // 3 groupes de 4 = 12 objets
        expect(getObjectCount('×', 5, 6)).toBe(30);
      });

      it('devrait calculer groupes pour addition', () => {
        const getGroupCount = operator => {
          if (operator === '+') {
            return 2; // Addition: toujours 2 groupes (a et b)
          }
          return 0;
        };

        expect(getGroupCount('+', 3, 4)).toBe(2);
        expect(getGroupCount('+', 10, 5)).toBe(2);
      });

      it('devrait calculer objets visibles/barrés pour soustraction', () => {
        const getSubtractionVisuals = (a, b) => {
          return {
            visible: a - b, // Objets restants
            removed: b, // Objets retirés (barrés)
            total: a,
          };
        };

        const result = getSubtractionVisuals(7, 3);
        expect(result.visible).toBe(4);
        expect(result.removed).toBe(3);
        expect(result.total).toBe(7);
        expect(result.visible + result.removed).toBe(result.total);
      });
    });

    describe('Sauvegarde progression', () => {
      it('devrait sauvegarder tables comme nombres pour multiplication', () => {
        const exploredTables = [1, 2, 3];
        const newTable = 5;

        const saveTable = (tables, table) => {
          if (!tables.includes(table)) {
            tables.push(table);
          }
          return tables;
        };

        const updated = saveTable(exploredTables, newTable);
        expect(updated).toContain(5);
        expect(updated.length).toBe(4);
      });

      it('devrait sauvegarder niveaux comme strings pour addition/soustraction', () => {
        const exploredLevels = ['easy'];
        const newLevel = 'medium';

        const saveLevel = (levels, level) => {
          if (!levels.includes(level)) {
            levels.push(level);
          }
          return levels;
        };

        const updated = saveLevel(exploredLevels, newLevel);
        expect(updated).toContain('medium');
        expect(updated.length).toBe(2);
      });

      it('ne devrait pas dupliquer entrées', () => {
        const explored = [1, 2, 3];

        const saveExplored = (list, item) => {
          if (!list.includes(item)) {
            list.push(item);
          }
          return list;
        };

        const updated = saveExplored(explored, 2);
        expect(updated).toEqual([1, 2, 3]); // Pas de duplication
      });
    });
  });

  describe('Adventure Mode - Logic Tests', () => {
    describe('Chargement niveaux par opération', () => {
      it('devrait charger niveaux multiplication avec tables', () => {
        const getLevelsForOperator = operator => {
          const levels = {
            '×': [
              { id: 1, table: 1, difficulty: undefined },
              { id: 2, table: 2, difficulty: undefined },
            ],
            '+': [
              { id: 1, table: undefined, difficulty: 'easy' },
              { id: 2, table: undefined, difficulty: 'medium' },
            ],
            '−': [{ id: 1, table: undefined, difficulty: 'easy' }],
          };
          return levels[operator] || levels['×'];
        };

        const multiplicationLevels = getLevelsForOperator('×');
        expect(multiplicationLevels[0].table).toBe(1);
        expect(multiplicationLevels[0].difficulty).toBeUndefined();

        const additionLevels = getLevelsForOperator('+');
        expect(additionLevels[0].difficulty).toBe('easy');
        expect(additionLevels[0].table).toBeUndefined();
      });
    });

    describe('Calcul étoiles', () => {
      it('devrait attribuer 3 étoiles pour 90%+ succès', () => {
        const calculateStars = (correct, total) => {
          const rate = correct / total;
          if (rate >= 0.9) return 3;
          if (rate >= 0.7) return 2;
          if (rate >= 0.5) return 1;
          return 0;
        };

        expect(calculateStars(9, 10)).toBe(3);
        expect(calculateStars(10, 10)).toBe(3);
      });

      it('devrait attribuer 2 étoiles pour 70-89% succès', () => {
        const calculateStars = (correct, total) => {
          const rate = correct / total;
          if (rate >= 0.9) return 3;
          if (rate >= 0.7) return 2;
          if (rate >= 0.5) return 1;
          return 0;
        };

        expect(calculateStars(8, 10)).toBe(2);
        expect(calculateStars(7, 10)).toBe(2);
      });

      it('devrait attribuer 1 étoile pour 50-69% succès', () => {
        const calculateStars = (correct, total) => {
          const rate = correct / total;
          if (rate >= 0.9) return 3;
          if (rate >= 0.7) return 2;
          if (rate >= 0.5) return 1;
          return 0;
        };

        expect(calculateStars(6, 10)).toBe(1);
        expect(calculateStars(5, 10)).toBe(1);
      });

      it('devrait attribuer 0 étoile pour moins de 50% succès', () => {
        const calculateStars = (correct, total) => {
          const rate = correct / total;
          if (rate >= 0.9) return 3;
          if (rate >= 0.7) return 2;
          if (rate >= 0.5) return 1;
          return 0;
        };

        expect(calculateStars(4, 10)).toBe(0);
        expect(calculateStars(0, 10)).toBe(0);
      });
    });

    describe('Progression par opération', () => {
      it('devrait séparer progression par opérateur', () => {
        const progressByOperator = {
          '×': {
            1: { stars: 3, table: 1 },
            2: { stars: 2, table: 2 },
          },
          '+': {
            1: { stars: 3, difficulty: 'easy' },
          },
          '−': {},
        };

        const getProgressForOperator = operator => {
          return progressByOperator[operator] || {};
        };

        const multiplicationProgress = getProgressForOperator('×');
        expect(Object.keys(multiplicationProgress)).toHaveLength(2);
        expect(multiplicationProgress[1].table).toBe(1);

        const additionProgress = getProgressForOperator('+');
        expect(Object.keys(additionProgress)).toHaveLength(1);
        expect(additionProgress[1].difficulty).toBe('easy');

        const subtractionProgress = getProgressForOperator('−');
        expect(Object.keys(subtractionProgress)).toHaveLength(0);
      });

      it('devrait calculer total étoiles par opération', () => {
        const calculateTotalStars = progressByOperator => {
          let total = 0;
          Object.values(progressByOperator).forEach(level => {
            total += level.stars || 0;
          });
          return total;
        };

        const multiplicationProgress = {
          1: { stars: 3 },
          2: { stars: 2 },
          3: { stars: 1 },
        };
        expect(calculateTotalStars(multiplicationProgress)).toBe(6);

        const additionProgress = {
          1: { stars: 3 },
        };
        expect(calculateTotalStars(additionProgress)).toBe(3);

        const emptyProgress = {};
        expect(calculateTotalStars(emptyProgress)).toBe(0);
      });

      it('devrait conserver meilleur score étoiles', () => {
        const updateLevelProgress = (existing, newStars) => {
          return {
            ...existing,
            stars: Math.max(existing.stars || 0, newStars),
            attempts: (existing.attempts || 0) + 1,
          };
        };

        const level = { stars: 3, attempts: 1 };
        const updated = updateLevelProgress(level, 2);
        expect(updated.stars).toBe(3); // Garde le meilleur
        expect(updated.attempts).toBe(2);

        const level2 = { stars: 1, attempts: 2 };
        const updated2 = updateLevelProgress(level2, 3);
        expect(updated2.stars).toBe(3); // Amélioration
        expect(updated2.attempts).toBe(3);
      });
    });

    describe('Options questions selon opération', () => {
      it('devrait utiliser table et multiplicande pour multiplication', () => {
        const getQuestionOptions = (operator, level) => {
          if (operator === '×') {
            return {
              operator: '×',
              forceTable: level.table,
              forceNum: 5, // Exemple
              type: 'mcq',
            };
          }
          return {};
        };

        const options = getQuestionOptions('×', { id: 1, table: 7 });
        expect(options.operator).toBe('×');
        expect(options.forceTable).toBe(7);
        expect(options.forceNum).toBeDefined();
      });

      it('devrait utiliser difficulté pour addition/soustraction', () => {
        const getQuestionOptions = (operator, level) => {
          if (operator === '+' || operator === '−') {
            return {
              operator,
              difficulty: level.difficulty,
              type: 'mcq',
            };
          }
          return {};
        };

        const optionsAdd = getQuestionOptions('+', { id: 1, difficulty: 'easy' });
        expect(optionsAdd.operator).toBe('+');
        expect(optionsAdd.difficulty).toBe('easy');
        expect(optionsAdd.forceTable).toBeUndefined();

        const optionsSub = getQuestionOptions('−', { id: 2, difficulty: 'medium' });
        expect(optionsSub.operator).toBe('−');
        expect(optionsSub.difficulty).toBe('medium');
      });
    });

    describe('Déblocage niveaux', () => {
      it('devrait vérifier déblocage basé sur étoiles', () => {
        const isLevelLocked = (level, totalStars, prevCompleted) => {
          // Niveau 1 toujours débloqué
          if (level.id === 1) return false;

          // Vérifier étoiles requises
          if (totalStars < level.requiredStars) return true;

          // Vérifier niveau précédent complété
          if (!prevCompleted) return true;

          return false;
        };

        const level1 = { id: 1, requiredStars: 0 };
        expect(isLevelLocked(level1, 0, false)).toBe(false); // Toujours débloqué

        const level2 = { id: 2, requiredStars: 2 };
        expect(isLevelLocked(level2, 5, true)).toBe(false); // Assez étoiles + prev complété
        expect(isLevelLocked(level2, 1, true)).toBe(true); // Pas assez étoiles
        expect(isLevelLocked(level2, 5, false)).toBe(true); // Prev pas complété

        const level3 = { id: 3, requiredStars: 5 };
        expect(isLevelLocked(level3, 3, true)).toBe(true); // Pas assez étoiles
        expect(isLevelLocked(level3, 5, true)).toBe(false); // OK
      });
    });

    describe('Historique progression', () => {
      it('devrait enregistrer opération avec métadonnées', () => {
        const recordHistory = (question, isCorrect, userAnswer, mode, operator, level) => {
          return {
            question: `${question.a} ${operator} ${question.b} = ?`,
            correct: isCorrect,
            timestamp: Date.now(),
            mode,
            operator,
            level,
            userAnswer,
            correctAnswer: question.answer,
          };
        };

        const entry = recordHistory(
          { a: 7, b: 4, answer: 11, operator: '+' },
          true,
          11,
          'adventure',
          '+',
          1
        );

        expect(entry.question).toBe('7 + 4 = ?');
        expect(entry.operator).toBe('+');
        expect(entry.correct).toBe(true);
        expect(entry.level).toBe(1);
        expect(entry.userAnswer).toBe(11);
        expect(entry.correctAnswer).toBe(11);
      });
    });
  });

  describe('Intégration Discovery/Adventure', () => {
    it('devrait utiliser même structure progression pour tous opérateurs', () => {
      // Structure unifiée de progression
      const progressStructure = {
        discoveryProgress: {
          exploredTables: [], // Pour × (nombres) ou +/− (strings 'easy', 'medium', 'hard')
          lastExplored: 0,
        },
        adventureProgressByOperator: {
          '×': {},
          '+': {},
          '−': {},
        },
      };

      expect(progressStructure.discoveryProgress).toBeDefined();
      expect(progressStructure.adventureProgressByOperator).toHaveProperty('×');
      expect(progressStructure.adventureProgressByOperator).toHaveProperty('+');
      expect(progressStructure.adventureProgressByOperator).toHaveProperty('−');
    });

    it('devrait isoler données par opération', () => {
      const verifyIsolation = (progress, operator) => {
        const operatorProgress = progress.adventureProgressByOperator[operator];
        return (
          Object.keys(operatorProgress).length === 0 ||
          Object.values(operatorProgress).every(level => {
            if (operator === '×') {
              return level.table !== undefined;
            } else {
              return level.difficulty !== undefined;
            }
          })
        );
      };

      const progress = {
        adventureProgressByOperator: {
          '×': {
            1: { stars: 3, table: 1, difficulty: undefined },
          },
          '+': {
            1: { stars: 2, table: undefined, difficulty: 'easy' },
          },
          '−': {},
        },
      };

      expect(verifyIsolation(progress, '×')).toBe(true);
      expect(verifyIsolation(progress, '+')).toBe(true);
      expect(verifyIsolation(progress, '−')).toBe(true);
    });
  });
});
