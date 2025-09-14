// Advanced Dashboard Components
class HealthAIDashboard {
    constructor() {
        this.charts = {};
        this.aiResponses = [];
        this.userPreferences = {};
        this.healthMetrics = {};
        this.riskPredictions = {};
    }

    // Digital Twin Simulation Engine
    async runAdvancedSimulation(type, parameters) {
        const simulationData = {
            diet: {
                carbReduction: parameters.carbReduction || 20,
                proteinIncrease: parameters.proteinIncrease || 10,
                fatAdjustment: parameters.fatAdjustment || 0
            },
            exercise: {
                cardioMinutes: parameters.cardioMinutes || 30,
                strengthTraining: parameters.strengthTraining || 15,
                intensity: parameters.intensity || 'moderate'
            },
            medication: {
                dosageChange: parameters.dosageChange || 0,
                timingAdjustment: parameters.timingAdjustment || 0,
                newMedication: parameters.newMedication || false
            }
        };

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));

        return this.generateSimulationResults(type, simulationData[type]);
    }

    generateSimulationResults(type, params) {
        const baseResults = {
            diet: {
                bloodSugarImpact: -15 - (params.carbReduction * 0.5),
                weightImpact: -2 - (params.carbReduction * 0.1),
                energyLevel: 5 + (params.proteinIncrease * 0.3),
                riskReduction: 8 + (params.carbReduction * 0.2),
                timeline: '2-4 weeks',
                confidence: 85
            },
            exercise: {
                cardiovascularImprovement: 20 + (params.cardioMinutes * 0.5),
                bloodPressureReduction: -8 - (params.cardioMinutes * 0.2),
                weightLoss: -1 - (params.cardioMinutes * 0.05),
                moodImprovement: 15 + (params.cardioMinutes * 0.3),
                timeline: '4-6 weeks',
                confidence: 90
            },
            medication: {
                effectiveness: 75 + (params.dosageChange * 2),
                sideEffects: 10 + Math.abs(params.dosageChange * 1.5),
                adherence: 85 - (params.timingAdjustment * 0.5),
                costImpact: params.newMedication ? 25 : 0,
                timeline: '1-2 weeks',
                confidence: 95
            }
        };

        return baseResults[type];
    }

    // AI Health Coach with Mood Adaptation
    async processMoodAdaptiveResponse(userMessage, userMood, healthContext) {
        const moodModifiers = {
            stressed: {
                tone: 'calming',
                suggestions: ['breathing exercises', 'meditation', 'gentle movement'],
                urgency: 'low'
            },
            motivated: {
                tone: 'encouraging',
                suggestions: ['goal setting', 'challenges', 'progress tracking'],
                urgency: 'high'
            },
            confused: {
                tone: 'educational',
                suggestions: ['simplified explanations', 'step-by-step guidance', 'resources'],
                urgency: 'medium'
            },
            discouraged: {
                tone: 'supportive',
                suggestions: ['small wins', 'celebration', 'support groups'],
                urgency: 'medium'
            }
        };

        const moodProfile = moodModifiers[userMood] || moodModifiers.motivated;
        
        // Generate contextual response
        const response = await this.generateContextualResponse(userMessage, moodProfile, healthContext);
        
        return {
            message: response,
            mood: userMood,
            suggestions: moodProfile.suggestions,
            nextActions: this.getNextActions(moodProfile.urgency)
        };
    }

    async generateContextualResponse(message, moodProfile, healthContext) {
        const responses = {
            greeting: [
                `Hello! I'm here to support you on your health journey. ${moodProfile.tone === 'calming' ? 'Let\'s take this one step at a time.' : 'Ready to make some positive changes?'}`,
                `Hi there! I can see you're working hard on your health. ${moodProfile.tone === 'encouraging' ? 'That\'s fantastic!' : 'Remember, every small step counts.'}`,
                `Welcome back! ${moodProfile.tone === 'supportive' ? 'I\'m here to help you succeed.' : 'Let\'s continue building on your progress.'}`
            ],
            question: [
                `That's a great question! ${moodProfile.tone === 'educational' ? 'Let me break this down for you.' : 'I\'m happy to help clarify this.'}`,
                `I understand your concern. ${moodProfile.tone === 'calming' ? 'Let\'s work through this together.' : 'Here\'s what I recommend.'}`,
                `Excellent question! ${moodProfile.tone === 'encouraging' ? 'This shows you\'re really engaged in your health.' : 'Let me provide some guidance.'}`
            ],
            concern: [
                `I hear your concern, and that's completely valid. ${moodProfile.tone === 'supportive' ? 'You\'re not alone in this.' : 'Let\'s address this together.'}`,
                `Thank you for sharing that with me. ${moodProfile.tone === 'calming' ? 'It\'s okay to feel this way.' : 'We can work through this.'}`,
                `I understand this is challenging. ${moodProfile.tone === 'supportive' ? 'Remember, progress isn\'t always linear.' : 'Let\'s find a solution.'}`
            ]
        };

        const messageType = this.categorizeMessage(message);
        const responsePool = responses[messageType] || responses.question;
        const baseResponse = responsePool[Math.floor(Math.random() * responsePool.length)];
        
        return baseResponse + ' ' + this.addHealthSpecificAdvice(message, healthContext);
    }

    categorizeMessage(message) {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) return 'greeting';
        if (lowerMessage.includes('worried') || lowerMessage.includes('concerned') || lowerMessage.includes('problem')) return 'concern';
        if (lowerMessage.includes('?')) return 'question';
        return 'question';
    }

    addHealthSpecificAdvice(message, healthContext) {
        const lowerMessage = message.toLowerCase();
        const advice = {
            bloodSugar: 'For blood sugar management, consider monitoring your carbohydrate intake and timing your meals consistently.',
            exercise: 'Regular physical activity is one of the most effective ways to manage chronic conditions. Start with what feels comfortable.',
            medication: 'Medication adherence is crucial. If you\'re having trouble, let\'s explore some strategies to make it easier.',
            diet: 'Nutrition plays a key role in managing chronic diseases. Focus on whole foods and balanced meals.',
            sleep: 'Quality sleep is essential for overall health and can significantly impact your condition management.',
            stress: 'Stress management is crucial. Consider techniques like deep breathing, meditation, or gentle movement.'
        };

        for (const [topic, suggestion] of Object.entries(advice)) {
            if (lowerMessage.includes(topic)) {
                return suggestion;
            }
        }

        return 'Remember, small consistent changes often lead to the biggest improvements in health outcomes.';
    }

    getNextActions(urgency) {
        const actions = {
            low: ['Take a deep breath', 'Review your progress', 'Plan for tomorrow'],
            medium: ['Set a small goal', 'Connect with support', 'Track one metric'],
            high: ['Take immediate action', 'Set a challenge', 'Share your progress']
        };

        return actions[urgency] || actions.medium;
    }

    // Advanced Risk Prediction
    async calculateRiskScore(userData, timeHorizon = 90) {
        const riskFactors = {
            bloodSugar: this.analyzeBloodSugarTrend(userData.bloodSugarHistory),
            bloodPressure: this.analyzeBloodPressureTrend(userData.bloodPressureHistory),
            medicationAdherence: this.calculateAdherenceRisk(userData.medicationHistory),
            lifestyle: this.assessLifestyleRisk(userData.lifestyleData),
            genetics: this.assessGeneticRisk(userData.geneticProfile)
        };

        const weights = {
            bloodSugar: 0.25,
            bloodPressure: 0.20,
            medicationAdherence: 0.20,
            lifestyle: 0.25,
            genetics: 0.10
        };

        let totalRisk = 0;
        for (const [factor, score] of Object.entries(riskFactors)) {
            totalRisk += score * weights[factor];
        }

        return {
            overallRisk: Math.round(totalRisk),
            riskFactors: riskFactors,
            timeHorizon: timeHorizon,
            recommendations: this.generateRiskRecommendations(riskFactors),
            alerts: this.generateRiskAlerts(riskFactors, totalRisk)
        };
    }

    analyzeBloodSugarTrend(history) {
        if (!history || history.length < 7) return 50;
        
        const recent = history.slice(-7);
        const average = recent.reduce((sum, val) => sum + val, 0) / recent.length;
        const trend = this.calculateTrend(recent);
        
        let risk = 50;
        if (average > 140) risk += 20;
        if (average > 180) risk += 15;
        if (trend > 0) risk += 10;
        
        return Math.min(100, Math.max(0, risk));
    }

    analyzeBloodPressureTrend(history) {
        if (!history || history.length < 7) return 50;
        
        const recent = history.slice(-7);
        const avgSystolic = recent.reduce((sum, val) => sum + val.systolic, 0) / recent.length;
        const avgDiastolic = recent.reduce((sum, val) => sum + val.diastolic, 0) / recent.length;
        
        let risk = 50;
        if (avgSystolic > 140 || avgDiastolic > 90) risk += 25;
        if (avgSystolic > 160 || avgDiastolic > 100) risk += 20;
        
        return Math.min(100, Math.max(0, risk));
    }

    calculateAdherenceRisk(medicationHistory) {
        if (!medicationHistory || medicationHistory.length < 30) return 50;
        
        const recent = medicationHistory.slice(-30);
        const adherenceRate = recent.filter(dose => dose.taken).length / recent.length;
        
        return Math.round((1 - adherenceRate) * 100);
    }

    assessLifestyleRisk(lifestyleData) {
        let risk = 50;
        
        if (lifestyleData.exercise < 150) risk += 15; // minutes per week
        if (lifestyleData.sleep < 7) risk += 10; // hours per night
        if (lifestyleData.stress > 7) risk += 15; // stress level 1-10
        if (lifestyleData.smoking) risk += 20;
        if (lifestyleData.alcohol > 2) risk += 10; // drinks per day
        
        return Math.min(100, Math.max(0, risk));
    }

    assessGeneticRisk(geneticProfile) {
        if (!geneticProfile) return 50;
        
        let risk = 50;
        if (geneticProfile.familyHistory.diabetes) risk += 15;
        if (geneticProfile.familyHistory.heartDisease) risk += 10;
        if (geneticProfile.familyHistory.hypertension) risk += 10;
        
        return Math.min(100, Math.max(0, risk));
    }

    calculateTrend(data) {
        if (data.length < 2) return 0;
        
        const n = data.length;
        const sumX = n * (n - 1) / 2;
        const sumY = data.reduce((sum, val) => sum + val, 0);
        const sumXY = data.reduce((sum, val, i) => sum + val * i, 0);
        const sumXX = n * (n - 1) * (2 * n - 1) / 6;
        
        return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    }

    generateRiskRecommendations(riskFactors) {
        const recommendations = [];
        
        if (riskFactors.bloodSugar > 70) {
            recommendations.push('Focus on carbohydrate management and meal timing');
        }
        if (riskFactors.bloodPressure > 70) {
            recommendations.push('Increase physical activity and reduce sodium intake');
        }
        if (riskFactors.medicationAdherence > 70) {
            recommendations.push('Set up medication reminders and simplify your routine');
        }
        if (riskFactors.lifestyle > 70) {
            recommendations.push('Prioritize sleep, exercise, and stress management');
        }
        
        return recommendations;
    }

    generateRiskAlerts(riskFactors, totalRisk) {
        const alerts = [];
        
        if (totalRisk > 80) {
            alerts.push({
                type: 'high',
                message: 'High risk detected - immediate attention recommended',
                urgency: 'urgent'
            });
        } else if (totalRisk > 60) {
            alerts.push({
                type: 'medium',
                message: 'Elevated risk - consider lifestyle adjustments',
                urgency: 'moderate'
            });
        }
        
        if (riskFactors.bloodSugar > 80) {
            alerts.push({
                type: 'bloodSugar',
                message: 'Blood sugar levels require attention',
                urgency: 'high'
            });
        }
        
        return alerts;
    }

    // Gamification System
    initializeGamification() {
        this.gamificationData = {
            streak: 0,
            achievements: [],
            points: 0,
            level: 1,
            challenges: [],
            rewards: []
        };
    }

    updateStreak(action) {
        const lastAction = localStorage.getItem('lastHealthAction');
        const today = new Date().toDateString();
        
        if (lastAction === today) {
            return; // Already logged today
        }
        
        this.gamificationData.streak++;
        localStorage.setItem('lastHealthAction', today);
        localStorage.setItem('healthStreak', this.gamificationData.streak);
        
        this.checkAchievements();
        this.updatePoints(action);
    }

    checkAchievements() {
        const achievements = [
            { id: 'first_week', name: 'First Week', requirement: 7, reward: 100 },
            { id: 'first_month', name: 'First Month', requirement: 30, reward: 500 },
            { id: 'consistency', name: 'Consistency Master', requirement: 100, reward: 1000 }
        ];
        
        achievements.forEach(achievement => {
            if (this.gamificationData.streak >= achievement.requirement && 
                !this.gamificationData.achievements.includes(achievement.id)) {
                this.gamificationData.achievements.push(achievement.id);
                this.gamificationData.points += achievement.reward;
                this.showAchievementNotification(achievement);
            }
        });
    }

    updatePoints(action) {
        const pointValues = {
            medication: 10,
            exercise: 15,
            food_log: 5,
            checkup: 25,
            goal_complete: 20
        };
        
        this.gamificationData.points += pointValues[action] || 5;
        this.updateLevel();
    }

    updateLevel() {
        const newLevel = Math.floor(this.gamificationData.points / 100) + 1;
        if (newLevel > this.gamificationData.level) {
            this.gamificationData.level = newLevel;
            this.showLevelUpNotification();
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <i class="fas fa-trophy"></i>
                <div>
                    <h4>Achievement Unlocked!</h4>
                    <p>${achievement.name}</p>
                    <span>+${achievement.reward} points</span>
                </div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #333;
            padding: 1rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    showLevelUpNotification() {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <i class="fas fa-star"></i>
                <div>
                    <h4>Level Up!</h4>
                    <p>You're now level ${this.gamificationData.level}</p>
                    <span>Keep up the great work!</span>
                </div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 1rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // AI Chat Integration
    async logHealthEvent(eventType, data) {
        try {
            const event = {
                timestamp: Date.now(),
                type: eventType,
                data: data,
                sessionId: 'session_' + Date.now(),
                user: currentUser.id
            };
            
            // Store in local chat logs
            const chatLogs = JSON.parse(localStorage.getItem('healthAI_chatLogs') || '[]');
            chatLogs.push(event);
            localStorage.setItem('healthAI_chatLogs', JSON.stringify(chatLogs));
            
            // Log to AI chatbot if available
            if (window.llama2Chatbot) {
                const message = `Health event: ${eventType} - ${JSON.stringify(data)}`;
                await window.llama2Chatbot.generateResponse(message, data);
            }
            
            console.log('Health event logged to AI system:', event);
            return event.sessionId;
        } catch (error) {
            console.error('Failed to log health event:', error);
            return null;
        }
    }

    generateHash(data) {
        // Simple hash function for demo purposes
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    // Privacy and Security
    encryptData(data) {
        // Simple encryption for demo purposes
        const key = 'healthAI_secret_key';
        const encrypted = btoa(JSON.stringify(data) + key);
        return encrypted;
    }

    decryptData(encryptedData) {
        try {
            const key = 'healthAI_secret_key';
            const decrypted = atob(encryptedData).replace(key, '');
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }

    // Export user data (GDPR compliance)
    exportUserData() {
        const userData = {
            profile: currentUser,
            healthMetrics: this.healthMetrics,
            gamification: this.gamificationData,
            chatHistory: JSON.parse(localStorage.getItem('healthAI_chatHistory') || '[]'),
            chatLogs: JSON.parse(localStorage.getItem('healthAI_chatLogs') || '[]')
        };
        
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `healthAI_data_${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // Delete user data (GDPR compliance)
    deleteUserData() {
        if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
            localStorage.removeItem('healthAI_user');
            localStorage.removeItem('healthAI_chatHistory');
            localStorage.removeItem('healthAI_chatLogs');
            localStorage.removeItem('healthStreak');
            localStorage.removeItem('lastHealthAction');
            
            // Clear chatbot history
            if (window.llama2Chatbot) {
                window.llama2Chatbot.clearHistory();
            }
            
            currentUser = null;
            showNotification('All data has been deleted.', 'success');
            
            // Redirect to home page
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }
}

// Initialize dashboard
const healthDashboard = new HealthAIDashboard();

// Export for use in main script
window.healthDashboard = healthDashboard;
